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
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
import { createAnimator } from './animator';
import Tool from './Tool';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

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

/**
 * This function is largely ChatGPT'd
 */
export const setupTrail = (
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  _: Tool,
): EffectComposer => {
  const composer = new EffectComposer(renderer);

  // draw the full scene every frame, but only clear the depth buffer
  const scenePass = new RenderPass(scene, camera);
  scenePass.clear = false; // do NOT clear color
  scenePass.clearDepth = true; // DO clear depth, so each frame’s depth test is fresh
  composer.addPass(scenePass);

  const trailCam = camera.clone();
  trailCam.layers.set(1); // only sees layer 1
  const trailMat = new MeshBasicMaterial({ color: 0xffffff });
  const conePass = new RenderPass(scene, trailCam);
  conePass.clear = false;
  conePass.clearDepth = true;
  conePass.overrideMaterial = trailMat;
  composer.addPass(conePass);

  const copyPass = new ShaderPass(CopyShader);
  copyPass.renderToScreen = true;
  composer.addPass(copyPass);

  return composer;
};

export const setupScene = (
  scene: Scene,
  renderer: WebGLRenderer,
  // composer: EffectComposer,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  cubeScene: Scene,
  cubeCamera: PerspectiveCamera,
  tool: Tool,
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
