import { create } from 'zustand';

export type SetAccelerationType = (acceleration: number) => void;
export type SetAnimationSpeedMultiplierType = (speed: number) => void;

interface AnimationState {
  accel: number;
  setAccel: SetAccelerationType;
  animSpeedMul: number;
  setAnimSpeedMul: SetAnimationSpeedMultiplierType;
}

export const useAnimationStore = create<AnimationState>((set) => ({
  accel: 2000,
  setAccel: (acceleration) => set((_) => ({ accel: acceleration })),
  animSpeedMul: 1,
  setAnimSpeedMul: (speed) => set((_) => ({ animSpeedMul: speed })),
}));
