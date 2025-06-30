import { create } from 'zustand';

export type RotaryType = 'Auto';
export const rotaryTypes: RotaryType[] = ['Auto'];
export type SetRotaryType = (rotary: RotaryType) => void;
export type SetRadiusType = (rotary: number) => void;

interface MachiningState {
  rot: RotaryType;
  setRot: SetRotaryType;
  rad: number;
  setRad: SetRadiusType;
}

export const useMachiningStore = create<MachiningState>((set) => ({
  rot: 'Auto',
  setRot: (rotary) => set((_) => ({ rot: rotary })),
  rad: 1,
  setRad: (radius) => set((_) => ({ rad: radius })),
}));
