import { create } from 'zustand';

export type ToggleViewOptionType = () => void;

interface ViewState {
  ortho: boolean;
  grid: boolean;
  axes: boolean;
  toggleOrtho: ToggleViewOptionType;
  toggleGrid: ToggleViewOptionType;
  toggleAxes: ToggleViewOptionType;
}

export const useViewStore = create<ViewState>((set) => ({
  ortho: false,
  grid: false,
  axes: true,
  toggleOrtho: () =>
    set((state) => ({
      ortho: !state.ortho,
    })),
  toggleGrid: () =>
    set((state) => ({
      grid: !state.grid,
    })),
  toggleAxes: () =>
    set((state) => ({
      axes: !state.axes,
    })),
}));
