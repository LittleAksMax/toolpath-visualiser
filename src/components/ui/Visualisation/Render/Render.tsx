import { FC, useCallback, useEffect, useRef } from 'react';
import {
  AxesHelper,
  BufferGeometry,
  Clock,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './Render.css';
import {
  disposeMaterial,
  setupCamera,
  setupClock,
  setupControls,
  setupScene,
  setupTool,
  setupTrail,
  setupViewCube,
} from './renderUtil';
import { useViewStore } from '../../../../stores/view';
import Tool from './Tool';
import CustomAxisHelper from './CustomAxisHelper';
import CustomGridHelper from './CustomGridHelper';

const Render: FC = () => {
  const { axes, grid } = useViewStore();

  // refs for components
  const sceneRef = useRef<Scene>(null!);
  const rendererRef = useRef<WebGLRenderer>(null!);
  const controlsRef = useRef<OrbitControls>(null!);
  const cameraRef = useRef<PerspectiveCamera>(null!);
  const toolRef = useRef<Tool>(null!);
  const clockRef = useRef<Clock>(null!);
  const trailBufRef = useRef<BufferGeometry>(null!);

  const axesRef = useRef<AxesHelper | null>(null);
  const gridRef = useRef<GridHelper | null>(null);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (container) {
      const scene = new Scene();
      sceneRef.current = scene;

      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // camera
      const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
      cameraRef.current = camera;

      // container-based setup
      const width = container.clientWidth;
      const height = container.clientHeight;

      // position & projection
      setupCamera(camera, width, height);

      // renderer sizing
      renderer.setSize(width, height);

      // controls
      const controls = setupControls(camera, renderer);
      controlsRef.current = controls;

      // set up view cube
      const { cubeScene, cubeCamera } = setupViewCube();

      // setup tool which we will then move
      const tool = setupTool(scene);
      toolRef.current = tool;

      // setup clock
      const clock = setupClock();
      clockRef.current = clock;

      // setup trails point buffer
      const { trailGeo, positions } = setupTrail(scene);
      trailBufRef.current = trailGeo;

      // NOTE: this is a hacky solution, but it works
      if (axes) {
        const helper = new CustomAxisHelper();
        scene.add(helper);
        axesRef.current = helper;
      } else if (!axes) {
        scene.remove(axesRef.current!);
        axesRef.current!.geometry.dispose();
        disposeMaterial(axesRef.current!.material);
        axesRef.current = null;
      }

      // build scene
      setupScene(
        scene,
        renderer,
        camera,
        controls,
        cubeScene,
        cubeCamera,
        tool,
        trailGeo,
        positions,
        width,
        height,
        clock,
      );
    } else {
      // cleanup on unmount
      const controls = controlsRef.current;
      const renderer = rendererRef.current;
      const trailBuf = trailBufRef.current;

      if (controls) controls.dispose();
      if (renderer) {
        const canvas = renderer.domElement;
        canvas.parentNode?.removeChild(canvas);
        renderer.dispose();
      }
      if (trailBuf) trailBuf.dispose();

      // clear refs
      sceneRef.current = undefined!;
      cameraRef.current = undefined!;
      rendererRef.current = undefined!;
      controlsRef.current = undefined!;
    }

    // to avoid warning from hacky solution above:
    // eslint-disable-next-line
  }, []);

  // setup axes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (axes && !axesRef.current) {
      const helper = new CustomAxisHelper();
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
      const helper = new CustomGridHelper();
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
