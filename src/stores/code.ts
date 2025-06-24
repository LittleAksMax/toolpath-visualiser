import { ChangeEvent } from 'react';
import { create } from 'zustand';

interface GCodeState {
  gcodeLines: string[];
  changeCode: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useGCodeStore = create<GCodeState>((set) => ({
  gcodeLines: [],
  changeCode: (e: ChangeEvent<HTMLInputElement>) =>
    set((state) => {
      const target = e.target as HTMLInputElement;
      const files = target.files as FileList;

      const fr = new FileReader();

      let lines: string[] = [];

      fr.onload = async (e: ProgressEvent<FileReader>) => {
        const code = e.target?.result;
        if (!code) {
          // TODO: error handling
          // error occurred, so keep the code the same
          lines = state.gcodeLines;
        }

        // split (definitely non-null code buffer string)
        // into lines of code
        const codeStr = code!.toString();
        lines = codeStr.split('\n').filter((line) => line.trim().length !== 0);
      };

      // read the first file (should be the only file)
      // just keep state as it was
      if (files.length !== 0) {
        // TODO: error handling
        return state;
      }
      fr.readAsText(files[0]);

      // return updated state
      return { gcodeLines: lines };
    }),
}));
