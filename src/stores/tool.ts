import { create } from 'zustand';

export type RotationPlane = 'XY' | 'YZ' | 'XZ';
export type SetRotationPlaneType = (rotationPlane: RotationPlane) => void;
export type Units = 'mm' | 'in';
export type SetUnitsType = (units: Units) => void;
export type Positioning = 'inc' | 'abs';
export type SetPositioningType = (positioning: Positioning) => void;
export type SetFeedRateType = (feedRate: number) => void;

interface ToolState {
  x: number;
  y: number;
  z: number; // TODO: translation from movement
  rotPlane: RotationPlane;
  setRotPlane: SetRotationPlaneType;
  units: Units;
  setUnits: SetUnitsType;
  pos: Positioning;
  setPos: SetPositioningType;
  feed: number;
  setFeed: SetFeedRateType;
}

export const useToolState = create<ToolState>((set) => ({
  x: 0,
  y: 0,
  z: 0,
  rotPlane: 'XY',
  setRotPlane: (rotationPlane: RotationPlane) =>
    set((_) => ({
      rotPlane: rotationPlane,
    })),
  units: 'in',
  setUnits: (units) => set((_) => ({ units })),
  pos: 'abs',
  setPos: (positioning: Positioning) => set((_) => ({ pos: positioning })),
  feed: 0, // must be set before moving
  setFeed: (feedRate: number) => set((_) => ({ feed: feedRate })),
}));
