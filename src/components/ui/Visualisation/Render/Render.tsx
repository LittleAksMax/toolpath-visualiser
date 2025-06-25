import { FC, useCallback, useEffect, useRef } from 'react';
import {
  AxesHelper,
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
  setupControls,
  setupScene,
} from './renderUtil';
import { useViewStore } from '../../../../stores/view';
import { useGCodeStore } from '../../../../stores/code';
// import { useToolState } from '../../../../stores/tool';

const Render: FC = () => {
  const { axes, grid } = useViewStore();
  const { gcodeLines } = useGCodeStore();
  // const { setRotPlane, setUnits, setPos } = useToolState();

  // refs for components
  const sceneRef = useRef<Scene>(null!);
  const rendererRef = useRef<WebGLRenderer>(null!);
  const controlsRef = useRef<OrbitControls>(null!);
  const cameraRef = useRef<PerspectiveCamera>(null!);
  const axesRef = useRef<AxesHelper | null>(null);
  const gridRef = useRef<GridHelper | null>(null);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (container) {
      // --- Initialize scene, camera, renderer ---
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

      // NOTE: this is a hacky solution, but it works
      if (axes) {
        const helper = new AxesHelper(100);
        scene.add(helper);
        axesRef.current = helper;
      } else if (!axes) {
        scene.remove(axesRef.current!);
        axesRef.current!.geometry.dispose();
        disposeMaterial(axesRef.current!.material);
        axesRef.current = null;
      }

      // user-defined scene build
      setupScene(scene, renderer, camera, controls, width, height);
    } else {
      // --- Cleanup on unmount ---
      const controls = controlsRef.current;
      const renderer = rendererRef.current;

      if (controls) controls.dispose();
      if (renderer) {
        const canvas = renderer.domElement;
        canvas.parentNode?.removeChild(canvas);
        renderer.dispose();
      }

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

  // update drawing when the code changes
  useEffect(() => {
    console.debug('Code changed!');
  }, [gcodeLines]);

  return <div className='render' ref={containerRef}></div>;
};

export default Render;

// useEffect(() => {
//   // create all scene components
//   const scene = new Scene();
//   const renderer = new WebGLRenderer({ alpha: true, antialias: true });
//   const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

//   // container setup
//   if (containerRef) {
//     containerRef.current.appendChild(renderer.domElement);
//   }

//   // scene setup
//   sceneRef.current = scene;

//   // camera setup
//   setupCamera(
//     camera,
//     containerRef.current.clientWidth,
//     containerRef.current.clientHeight,
//   );
//   cameraRef.current = camera;

//   // renderer setup
//   renderer.setSize(
//     containerRef.current.clientWidth,
//     containerRef.current.clientHeight,
//   );
//   containerRef.current.appendChild(renderer.domElement);
//   rendererRef.current = renderer;

//   // controls
//   const controls = setupControls(camera, renderer);
//   controlsRef.current = controls;

//   setupScene(
//     scene,
//     renderer,
//     camera,
//     controls,
//     containerRef.current.clientWidth,
//     containerRef.current.clientHeight,
//   );

//   return () => {
//     controls.dispose();
//     containerRef.current.removeChild(renderer.domElement);
//     renderer.dispose();
//   };
// }, []);
