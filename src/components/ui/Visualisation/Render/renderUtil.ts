import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  MeshBasicMaterial,
  Material,
  ConeGeometry,
  BoxGeometry,
  Camera,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const setupCamera = (
  camera: PerspectiveCamera, // NOTE: haven't implemented ortho camera
  width: number,
  height: number,
): PerspectiveCamera => {
  camera.aspect = width / height;
  camera.lookAt(0, 0, 0);
  camera.position.set(200, 200, 200);
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

export const setupScene = (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  controls: OrbitControls,
  width: number,
  height: number,
) => {
  const geometry = new ConeGeometry(2, 8, 8);

  const material = new MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.5,
  });
  const cone = new Mesh(geometry, material);
  cone.rotateX(-Math.PI / 2);
  cone.position.set(0, 0, 4);

  scene.add(cone);

  // view cube
  const cubeScene = new Scene();
  const viewCube = new Mesh(
    new BoxGeometry(2, 2, 2),
    new MeshBasicMaterial({ color: 0x888888, wireframe: true }),
  );
  cubeScene.add(viewCube);
  const cubeCamera = new PerspectiveCamera(50, 1, 0.1, 1000);

  const animate = () => {
    requestAnimationFrame(animate);

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

  animate();
};

export const disposeMaterial = (material: Material | Material[]) => {
  if (Array.isArray(material)) {
    material.forEach((mat) => mat.dispose());
  } else {
    material.dispose();
  }
};
