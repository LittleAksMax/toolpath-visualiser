import { create } from 'zustand';

export type ToggleViewOptionType = () => void;

interface ViewState {
  grid: boolean;
  axes: boolean;
  toggleGrid: ToggleViewOptionType;
  toggleAxes: ToggleViewOptionType;
}

export const useViewStore = create<ViewState>((set) => ({
  grid: false,
  axes: true,
  toggleGrid: () =>
    set((state) => ({
      grid: !state.grid,
    })),
  toggleAxes: () =>
    set((state) => ({
      axes: !state.axes,
    })),
}));
