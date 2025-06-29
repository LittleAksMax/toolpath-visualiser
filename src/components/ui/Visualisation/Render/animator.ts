import { Clock, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useCursor, useGCodeFile } from '../../../../stores/code';
import { useTool } from '../../../../stores/tool';
import {
  CircularMoveCommand,
  interpretCommand,
  LinearMoveCommand,
} from './animationUtil';
import { useCoords } from '../../../../stores/coords';
import Tool from './Tool';

export type Animator = () => void;

export const createAnimator = (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  cubeScene: Scene,
  cubeCamera: PerspectiveCamera,
  toolMesh: Tool,
  width: number,
  height: number,
  clock: Clock,
): Animator => {
  // local variables for keeping track
  let start = new Vector3();
  let end = new Vector3();
  let distance = 0; // distance travelled in maneouvre to gauge time taken
  let tProgress = 0; // progress of current manoeuvre
  let movementType: number; // track type of movement (G0,G1,G2,G3) so we know how to move
  let currentlyMoving: boolean = false;

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
    const lineNo = cursor.line;
    const maxLine = cursor.maxLine;

    // start and not playing => we should be at 0,0,0
    if (lineNo === 0 && !cursor.sim) {
      toolMesh.resetPosition();

      // reset separate coordinates store
      coords.setVec(toolMesh.position);

      currentlyMoving = false;
    }

    // maxLine !== 0 ensures that there is a valid program loaded
    // and we don't waste time
    // however, since we advance the line before finishing the move,
    // we just check if we are currently moving as well
    if (cursor.sim && maxLine !== 0 && lineNo < maxLine) {
      // if not moving, then we want to execute the next command
      // and start moving
      console.debug(
        currentlyMoving + ' [' + lineNo + '] ' + code.lines[lineNo],
      );
      if (!currentlyMoving) {
        const line = code.lines[lineNo];
        const cmd = interpretCommand(line, tool, coords);

        if (!cmd) {
          // move onto next command since it is clearly not needed
          cursor.nextLine();
        }
        // set data about the drill
        else if (cmd.type === 'G17') tool.setRotPlane('XY');
        else if (cmd.type === 'G18') tool.setRotPlane('ZX');
        else if (cmd.type === 'G19') tool.setRotPlane('YZ');
        else if (cmd.type === 'G20') tool.setUnits('in');
        else if (cmd.type === 'G21') tool.setUnits('mm');
        else if (cmd.type === 'G90') tool.setPos('abs');
        else if (cmd.type === 'G91') tool.setPos('inc');
        else if (cmd.type === 'G93') tool.setFeedMode('reg');
        else if (cmd.type === 'G94') tool.setFeedMode('inv');
        // movement commands
        else {
          // we will start moving after reading a movement instruction
          // in any case
          currentlyMoving = true;
          tProgress = 0;

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

            switch (tool.rotPlane) {
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

            movementType = 2;
          } else {
            // G3
            const { x, y, z, i, j, k } = cmd as CircularMoveCommand;

            start.copy(toolMesh.position);
            end.set(x, y, z);

            switch (tool.rotPlane) {
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

            movementType = 3;
          }
        }
      }

      if (currentlyMoving) {
        // normalise progress by distance so all moves take 0.5s keep
        // in mind we are completely ignoring feed rate (for simplicity)
        tProgress += distance > 0 ? (4 * delta) / distance : 1;
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
          currentlyMoving = false;
          cursor.nextLine();
        }
      }
    }

    requestAnimationFrame(animate);

    // update controls
    controls.update();

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
