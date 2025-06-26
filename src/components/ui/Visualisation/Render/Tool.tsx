import { ConeGeometry, Mesh, MeshBasicMaterial } from 'three';

const TOOL_RADIUS = 0.2;
const TOOL_HEIGHT = 0.8;
const TOOL_RADIAL_SEGMENTS = 8;

/**
 * Wrapper around standard Mesh to make up for the z
 * offset due to how cone's position is taken from the
 * centre of the ConeGeometry.
 */
export default class Tool extends Mesh {
  public static Z_OFFSET = 0.4;

  constructor() {
    const geometry = new ConeGeometry(
      TOOL_RADIUS,
      TOOL_HEIGHT,
      TOOL_RADIAL_SEGMENTS,
    );
    const material = new MeshBasicMaterial({
      color: 0x0000ff,
      transparent: true,
      opacity: 0.5,
    });
    super(geometry, material);
    this.rotateX(-Math.PI / 2);
  }

  public resetPosition = () => {
    this.position.set(0, 0, 0);
  };
}
