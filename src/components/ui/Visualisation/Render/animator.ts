import {
  BufferGeometry,
  Clock,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useCursor, useGCodeFile } from '../../../../stores/code';
import { RotationPlane, useTool } from '../../../../stores/tool';
import {
  CircularMoveCommand,
  delegator,
  interpretCommand,
  LinearMoveCommand,
} from './commandUtil';
import { useCoords } from '../../../../stores/coords';
import Tool from './Tool';
import { MAX_TRAIL_POINTS } from './renderUtil';

export type Animator = () => void;

enum ToolState {
  STARTING,
  MOVING,
  STOPPED,
}

const setCentre = (
  centre: Vector3,
  start: Vector3,
  i: number,
  j: number,
  k: number,
  rotPlane: RotationPlane,
) => {
  switch (rotPlane) {
    case 'XY':
      centre.setX(start.x + i);
      centre.setY(start.y + j);
      centre.setZ(start.z);
      break;
    case 'ZX':
      centre.setX(start.x + i);
      centre.setY(start.y);
      centre.setZ(start.z + k);
      break;
    case 'YZ':
      centre.setX(start.x);
      centre.setY(start.y + j);
      centre.setZ(start.z + k);
      break;
  }
};

const sToolState = (s: ToolState): 'STARTING' | 'MOVING' | 'STOPPED' =>
  s === ToolState.STARTING
    ? 'STARTING'
    : s === ToolState.MOVING
    ? 'MOVING'
    : 'STOPPED';

const log = (s: ToolState, msg: any) =>
  console.debug('<' + sToolState(s) + '> ' + msg);

export const createAnimator = (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  cubeScene: Scene,
  cubeCamera: PerspectiveCamera,
  toolMesh: Tool,
  trailBuf: BufferGeometry,
  trailPositions: Float32Array,
  width: number,
  height: number,
  clock: Clock,
): Animator => {
  // keep track of how many trail points are around
  let drawCount = 0;

  // variables for keeping track manoeuvre progress
  let start = new Vector3();
  let end = new Vector3();
  let distance = 0; // distance travelled in maneouvre to gauge time taken
  let tProgress = 0; // progress of current manoeuvre
  let movementType: number; // track type of movement (G0,G1,G2,G3) so we know how to move
  let state = ToolState.STARTING;

  // fields specific for circular interpolation
  // let radius: number; // for radius of arc
  let centre: Vector3 = new Vector3(); // for centre of circle of arc

  const animate = () => {
    // state for execution
    const code = useGCodeFile.getState();
    const cursor = useCursor.getState();
    const tool = useTool.getState();
    const coords = useCoords.getState();

    // since we are interpolating moves
    const delta = clock.getDelta();

    // start and not playing => we should be at 0,0,0
    if (cursor.line === 0 && !cursor.sim) {
      toolMesh.resetPosition();

      // reset separate coordinates store
      coords.setVec(toolMesh.position);

      // reset number of points in trail
      drawCount = 0;
      trailBuf.setDrawRange(0, 0);
      trailBuf.attributes.position.needsUpdate = true; // force re-upload of position buffer

      state = ToolState.STARTING;
    }

    // maxLine !== 0 ensures that there is a valid program loaded
    // and we don't waste time
    // however, since we advance the line before finishing the move,
    // we just check if we are currently moving as well
    if (cursor.sim && cursor.maxLine !== 0 && cursor.line < cursor.maxLine) {
      // if not moving, then we want to execute the next command
      // and start moving
      if (state === ToolState.STARTING) {
        log(state, cursor.line);
        const line = code.lines[cursor.line];
        const cmd = interpretCommand(line, tool, coords);

        console.debug(cmd);

        if (!cmd) {
          // move onto next command since it is clearly not needed
          state = ToolState.STOPPED;
        } else if (cmd.type in delegator) {
          // set data about the drill for non-move commands
          delegator[cmd.type](tool);
          state = ToolState.STOPPED;
        } else {
          // movement commands
          if (cmd.type === 'G0') {
            const { x, y, z } = cmd as LinearMoveCommand;
            start.copy(toolMesh.position);
            end.set(x, y, z);

            // get distance of linear movement
            distance = start.distanceTo(end);

            movementType = 0;
          } else if (cmd.type === 'G1') {
            const { x, y, z } = cmd as LinearMoveCommand;
            start.copy(toolMesh.position);

            end.set(x, y, z);
            // get distance of linear movement
            distance = start.distanceTo(end);

            movementType = 1;
          } else if (cmd.type === 'G2') {
            const { x, y, z, i, j, k } = cmd as CircularMoveCommand;

            start.copy(toolMesh.position);
            end.set(x, y, z);

            setCentre(centre, start, i, j, k, tool.rotPlane);

            movementType = 2;
          } else {
            // G3
            const { x, y, z, i, j, k } = cmd as CircularMoveCommand;

            start.copy(toolMesh.position);
            end.set(x, y, z);

            setCentre(centre, start, i, j, k, tool.rotPlane);

            movementType = 3;
          }

          // we will start moving after reading a movement instruction
          // in any case
          state = ToolState.MOVING;
          tProgress = 0;
        }
      }

      if (state === ToolState.MOVING) {
        log(state, cursor.line);

        // normalise progress by distance so all moves take 0.5s keep
        // in mind we are completely ignoring feed rate (for simplicity)
        tProgress += distance > 0 ? (2 * delta) / distance : 1;
        const t = Math.min(tProgress, 1);

        if (movementType === 0 || movementType === 1) {
          // linear interpolation
          toolMesh.position.lerpVectors(start, end, t);
          coords.setVec(toolMesh.position);
        } else {
          // we should invert the direction for G2 and G3
          // as G2 is clockwise, and G3 is counter-clockwise
          // const directionMultiplier = movementType === 2 ? 1 : -1;
          // TODO: handle circular movements
        }

        // since all movements take roughly 1 second, we wait until about 1 second
        // has passed and then assume the manoeuvre is over
        if (t >= 1) {
          state = ToolState.STOPPED;
        }
      }

      if (state === ToolState.STOPPED) {
        log(state, cursor.line);
        cursor.nextLine();

        console.debug(cursor.line);

        state = ToolState.STARTING;
      }
    }

    requestAnimationFrame(animate);

    // update controls
    controls.update();

    // — record current cone world-position —
    if (drawCount < MAX_TRAIL_POINTS) {
      // write into the next slot in our Float32Array
      trailPositions[drawCount * 3 + 0] = toolMesh.position.x;
      trailPositions[drawCount * 3 + 1] = toolMesh.position.y;
      trailPositions[drawCount * 3 + 2] = toolMesh.position.z;
      drawCount++;
      trailBuf.setDrawRange(0, drawCount);
      trailBuf.attributes.position.needsUpdate = true;
    }

    // render main scene
    renderer.setViewport(0, 0, width, height);
    renderer.clear();
    renderer.render(scene, camera);

    // render view cube in corner
    const size = Math.min(width, height) * 0.2;
    renderer.clearDepth();
    renderer.setScissorTest(true);
    renderer.setScissor(width - size - 10, 10, size, size);
    renderer.setViewport(width - size - 10, 10, size, size);

    // sync orientation
    cubeCamera.position.copy(camera.position).normalize().multiplyScalar(5);
    cubeCamera.up.copy(camera.up);
    cubeCamera.lookAt(0, 0, 0);
    renderer.render(cubeScene, cubeCamera);

    renderer.setScissorTest(false);
  };

  return animate;
};
