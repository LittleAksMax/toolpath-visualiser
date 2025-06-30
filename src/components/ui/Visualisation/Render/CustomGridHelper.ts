import { GridHelper } from 'three';

const GRID_SIZE = 20;
const GRID_SECTIONS = 16;

class CustomGridHelper extends GridHelper {
  constructor() {
    super(GRID_SIZE, GRID_SECTIONS);

    // basic setup
    this.material.transparent = true;
    this.material.opacity = 0.25;
    this.rotateX(Math.PI / 2);
  }
}

export default CustomGridHelper;
