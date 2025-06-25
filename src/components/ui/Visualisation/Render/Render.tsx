import { FC, useCallback, useEffect, useRef } from 'react';
import {
  AxesHelper,
  GridHelper,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Render.css';
import { disposeMaterial, setupScene } from './renderUtil';
import { useViewStore } from '../../../../stores/view';

const Render: FC = () => {
  const { axes, grid } = useViewStore();

  // TODO: disposal of objects
  // refs for components
  const sceneRef = useRef<Scene>(null!);
  const rendererRef = useRef<WebGLRenderer>(null!);
  const controlsRef = useRef<OrbitControls>(null!);
  const cameraRef = useRef<PerspectiveCamera | OrthographicCamera>(null!);
  const axesRef = useRef<AxesHelper | null>(null);
  const gridRef = useRef<GridHelper | null>(null);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (!container || sceneRef.current) {
      return;
    }

    // create all scene components
    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    // camera setup
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    cameraRef.current = camera;

    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 3;
    controlsRef.current = controls;

    setupScene(scene, renderer, camera, controls);
  }, []);

  // setup axes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (axes && !axesRef.current) {
      const helper = new AxesHelper(100);
      scene.add(helper);
      axesRef.current = helper;
    } else if (!axes && axesRef.current) {
      scene.remove(axesRef.current);
      axesRef.current.geometry.dispose();
      disposeMaterial(axesRef.current.material);
      axesRef.current = null;
    }
  }, [axes]);

  // setup grid
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (grid && !gridRef.current) {
      const helper = new GridHelper(200, 16);
      helper.material.transparent = true;
      helper.material.opacity = 0.25;
      helper.rotateX(Math.PI / 2);
      scene.add(helper);
      gridRef.current = helper;
    } else if (!grid && gridRef.current) {
      scene.remove(gridRef.current);
      gridRef.current.geometry.dispose();
      disposeMaterial(gridRef.current.material);
      gridRef.current = null;
    }
  }, [grid]);

  return <div className='render' ref={containerRef}></div>;
};

export default Render;
