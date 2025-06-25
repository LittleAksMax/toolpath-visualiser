import { create } from 'zustand';

export type ChangeCoordType = (val: number) => void;

export interface CoordState {
  x: number;
  y: number;
  z: number;
  setX: ChangeCoordType;
  setY: ChangeCoordType;
  setZ: ChangeCoordType;
}

export const useCoordStore = create<CoordState>((set) => ({
  x: 0,
  y: 0,
  z: 0,
  setX: (x: number) => set((_) => ({ x })),
  setY: (y: number) => set((_) => ({ y })),
  setZ: (z: number) => set((_) => ({ z })),
}));
