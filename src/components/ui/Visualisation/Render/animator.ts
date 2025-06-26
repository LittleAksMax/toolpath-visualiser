import { Clock, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useCursor, useGCodeFile } from '../../../../stores/code';
import { useTool } from '../../../../stores/tool';
import { interpretCommand, LinearMoveCommand } from './animationUtil';
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
  let currentlyMoving = false;
  let start = new Vector3();
  let end = new Vector3();
  let distance = 0; // distance travelled in maneouvre to gauge time taken
  let tProgress = 0; // progress of current manoeuvre

  const animate = () => {
    // state for execution
    const code = useGCodeFile.getState();
    const cursor = useCursor.getState();
    const tool = useTool.getState();
    const coords = useCoords.getState();

    requestAnimationFrame(animate);

    // since we are interpolating moves
    const delta = clock.getDelta();
    const lineNo = cursor.line;
    const maxLine = cursor.maxLine;

    // start and not playing => we should be at 0,0,0
    if (lineNo === 0 && !cursor.sim) {
      toolMesh.resetPosition();

      // reset separate coordinates store
      coords.reset();
    }

    // maxLine !== 0 ensures that there is a valid program loaded
    // and we don't waste time
    if (cursor.sim && maxLine !== 0 && lineNo < maxLine) {
      // if not moving, then we want to execute the next command
      // and start moving
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
            const mCmd = cmd as LinearMoveCommand;
            currentlyMoving = true;
            start.copy(toolMesh.position);
            end.setX(mCmd.x);
            end.setY(mCmd.y);
            end.setZ(mCmd.z);

            // get distance of linear movement
            distance = start.distanceTo(end);
          } else if (cmd.type === 'G1') {
            const mCmd = cmd as LinearMoveCommand;
            start.copy(toolMesh.position);

            end.setX(mCmd.x);
            end.setY(mCmd.y);
            end.setZ(mCmd.z);

            // get distance of linear movement
            distance = start.distanceTo(end);
          } else if (cmd.type === 'G2') {
          } else {
            // G3
          }
        }
      }

      if (currentlyMoving) {
        // normalise progress by distance so all moves take 1s keep
        // in mind we are completely ignoring feed rate (for simplicity)
        tProgress += distance > 0 ? delta / distance : 1;
        const t = Math.min(tProgress, 1);

        // linear interpolation
        toolMesh.position.lerpVectors(start, end, t);
        coords.setVec(toolMesh.position);

        // since all movements take roughly 1 second, we wait until about 1 second
        // has passed and then assume the manoeuvre is over
        if (t >= 1) {
          currentlyMoving = false;
          cursor.nextLine();
        }
      }
    }

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
