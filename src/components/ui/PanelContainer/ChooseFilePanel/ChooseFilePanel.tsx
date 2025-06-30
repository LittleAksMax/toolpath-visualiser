import { FC } from 'react';
import { useCursor, useGCodeFile } from '../../../../stores/code';
import { readCodeFile } from './codeReadUtil';

const ChooseFilePanel: FC = () => {
  const { changeLines } = useGCodeFile();
  const { sim, toggleSim } = useCursor();
  return (
    <div>
      <input
        type='file'
        accept='.gcode'
        onChange={(e) => {
          readCodeFile(e.target.files?.[0], changeLines);
          if (sim) toggleSim(); // ensure sim is not playing
        }}
      />
    </div>
  );
};

export default ChooseFilePanel;
