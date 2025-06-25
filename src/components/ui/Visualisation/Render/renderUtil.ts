import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  Mesh,
  MeshBasicMaterial,
  Material,
  ConeGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const setupCamera = (
  ortho: boolean,
  width: number,
  height: number,
): PerspectiveCamera | OrthographicCamera => {
  if (ortho) {
    const camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );

    return camera;
  } else {
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    // camera setup
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    return camera;
  }
};

export const setupScene = (
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera | OrthographicCamera,
  controls: OrbitControls,
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

  camera.lookAt(0, 0, 0);
  camera.position.set(200, 200, 200);
  camera.up.set(0, 0, 1); // set Z axis as the vertical

  const animate = () => {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
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
