import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  Material,
  BoxGeometry,
  Camera,
  Clock,
  Object3D,
  BufferGeometry,
  BufferAttribute,
  LineBasicMaterial,
  Line,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createAnimator } from './animator';
import Tool from './Tool';

export const setupCamera = (
  camera: PerspectiveCamera, // NOTE: haven't implemented ortho camera
  width: number,
  height: number,
): PerspectiveCamera => {
  camera.aspect = width / height;
  camera.lookAt(0, 0, 0);
  camera.position.set(10, 10, 10);
  camera.up.set(0, 0, 1);
  camera.updateProjectionMatrix();
  return camera;
};

export const setupControls = (
  camera: Camera,
  renderer: WebGLRenderer,
): OrbitControls => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.update();

  return controls;
};

export const setupViewCube = (): {
  cubeScene: Scene;
  cubeCamera: PerspectiveCamera;
} => {
  // view cube
  const cubeScene = new Scene();
  const viewCube = new Mesh(
    new BoxGeometry(2, 2, 2),
    new MeshBasicMaterial({ color: 0x888888, wireframe: true }),
  );
  cubeScene.add(viewCube);
  const cubeCamera = new PerspectiveCamera(50, 1, 0.1, 1000);

  return { cubeScene, cubeCamera };
};

export const setupTool = (scene: Scene): Tool => {
  const offsetParent = new Object3D();
  offsetParent.translateZ(Tool.Z_OFFSET);
  scene.add(offsetParent);

  const cone = new Tool();
  offsetParent.add(cone);
  // we don't even need to add cone to the scene explicitly

  return cone;
};

export const setupClock = (): Clock => {
  return new Clock();
};

const TRAIL_COLOUR = 0x02ccfe;
export const MAX_TRAIL_POINTS = 10000;

/**
 * This function is largely ChatGPT'd
 */
export const setupTrail = (scene: Scene) => {
  // maximum number of points your trail will ever have:

  // hold all trail points in buffer
  const trailGeo = new BufferGeometry();
  const positions = new Float32Array(MAX_TRAIL_POINTS * 3); // x, y, z per point
  trailGeo.setAttribute('position', new BufferAttribute(positions, 3));
  trailGeo.setDrawRange(0, 0); // start with zero points

  const trailMat = new LineBasicMaterial({ color: TRAIL_COLOUR });

  const trailLine = new Line(trailGeo, trailMat);
  scene.add(trailLine);

  return { trailGeo, positions };
};

export const setupScene = (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  cubeScene: Scene,
  cubeCamera: PerspectiveCamera,
  tool: Tool,
  trailBuf: BufferGeometry,
  trailPositions: Float32Array,
  width: number,
  height: number,
  clock: Clock,
) => {
  const animate = createAnimator(
    scene,
    renderer,
    camera,
    controls,
    cubeScene,
    cubeCamera,
    tool,
    trailBuf,
    trailPositions,
    width,
    height,
    clock,
  );

  animate();
};

export const disposeMaterial = (material: Material | Material[]) => {
  if (Array.isArray(material)) {
    material.forEach((mat) => mat.dispose());
  } else {
    material.dispose();
  }
};
