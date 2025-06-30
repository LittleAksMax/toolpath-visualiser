import { create } from 'zustand';

export type RotationPlane = 'XY' | 'YZ' | 'ZX';
export type SetRotationPlaneType = (rotationPlane: RotationPlane) => void;
export type Units = 'mm' | 'in';
export type SetUnitsType = (units: Units) => void;
export type Positioning = 'inc' | 'abs';
export type SetPositioningType = (positioning: Positioning) => void;
export type SetFeedRateType = (feedRate: number) => void;
export type FeedRateMode = 'reg' | 'inv';
export type SetFeedRateModeType = (mode: FeedRateMode) => void;

export interface ToolState {
  rotPlane: RotationPlane;
  setRotPlane: SetRotationPlaneType;
  units: Units;
  setUnits: SetUnitsType;
  pos: Positioning;
  setPos: SetPositioningType;
  feed: number;
  setFeed: SetFeedRateType;
  feedMode: FeedRateMode;
  setFeedMode: SetFeedRateModeType;
}

export const useTool = create<ToolState>((set) => ({
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
  feedMode: 'reg',
  setFeedMode: (mode: FeedRateMode) => set((_) => ({ feedMode: mode })),
}));
