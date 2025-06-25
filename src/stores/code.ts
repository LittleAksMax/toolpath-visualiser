import { create } from 'zustand';

export type ChangeCodeType = (e: string[]) => void;

interface GCodeState {
  gcodeLines: string[];
  changeCode: ChangeCodeType;
}

export const useGCodeStore = create<GCodeState>((set) => ({
  gcodeLines: [],
  changeCode: (newLines: string[]) => set((_) => ({ gcodeLines: newLines })),
}));
