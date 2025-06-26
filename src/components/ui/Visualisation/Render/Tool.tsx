import { ConeGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';

const TOOL_RADIUS = 0.2;
const TOOL_HEIGHT = 0.8;
const TOOL_RADIAL_SEGMENTS = 8;
const Z_OFFSET = 0.4;

/**
 * Wrapper around standard Mesh to make up for the z
 * offset due to how cone's position is taken from the
 * centre of the ConeGeometry.
 */
export default class Tool extends Mesh {
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
    this.resetPosition();
  }

  /**
   * Wrapper around Vector3.lerpVectors to enable us to correct
   * for the offset.
   */
  public lerpVectors = (start: Vector3, end: Vector3, t: number) => {
    let offsetEnd: Vector3 = new Vector3().copy(end);
    offsetEnd.setZ(offsetEnd.z + Z_OFFSET);
    this.position.lerpVectors(start, offsetEnd, t);
  };

  /**
   * Function used to move the drill of the tool to 0, 0, 0.
   * Since we must keep the offset in mind.
   */
  public resetPosition = () => {
    this.position.set(0, 0, Z_OFFSET);
  };
}
