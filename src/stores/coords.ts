import { Vector3 } from 'three';
import { create } from 'zustand';

export type ChangeCoordType = (val: number) => void;
export type ChangeCoordVecType = (vec: Vector3) => void;

export interface CoordState {
  x: number;
  y: number;
  z: number;
  setX: ChangeCoordType;
  setY: ChangeCoordType;
  setZ: ChangeCoordType;
  setVec: ChangeCoordVecType;
}

export const useCoords = create<CoordState>((set) => ({
  x: 0,
  y: 0,
  z: 0,
  setX: (x: number) => set((_) => ({ x })),
  setY: (y: number) => set((_) => ({ y })),
  setZ: (z: number) => set((_) => ({ z })),
  setVec: (vec: Vector3) => set((_) => ({ x: vec.x, y: vec.y, z: vec.z })),
}));
