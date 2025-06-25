import { FC, useEffect, useRef } from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';
import './Render.css';

const Render: FC = () => {
  const refContainer = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new WebGLRenderer();
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body

    if (refContainer.current) {
      refContainer.current.appendChild(renderer.domElement);
    }

    const width = refContainer.current!.clientWidth;
    const height = refContainer.current!.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div className='render' ref={refContainer}></div>;
};

export default Render;
