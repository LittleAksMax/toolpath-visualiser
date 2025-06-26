import { create } from 'zustand';

export type ChangeCodeType = (e: string[]) => void;
export type NextLineType = () => void;
export type ResetLineType = () => void;

interface GCodeState {
  lines: string[];
  changeLines: ChangeCodeType;
}

interface GCodeCursor {
  line: number;
  nextLine: NextLineType;
  resetLine: ResetLineType;
  maxLine: number;
}

// cursor-store.ts – tiny, updates every tick
export const useCursor = create<GCodeCursor>()((set) => ({
  line: 0,
  nextLine: () => set((s) => ({ line: s.line + 1 })),
  resetLine: () => set({ line: 0 }),
  maxLine: 0,
}));

// gcode-file-store.ts  – large, almost never changes
export const useGCodeFile = create<GCodeState>()((set) => ({
  lines: [],
  changeLines: (ls) => {
    set({ lines: ls });
    useCursor.getState().resetLine(); // set line to 0 on new file
    useCursor.getState().maxLine = ls.length; // set max lines
  },
}));
