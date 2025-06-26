import { FC } from 'react';
import { useGCodeFile } from '../../../../stores/code';
import { readCodeFile } from './codeReadUtil';

const ChooseFilePanel: FC = () => {
  const { changeLines } = useGCodeFile();
  return (
    <div>
      <input
        type='file'
        accept='.gcode'
        onChange={(e) => readCodeFile(e.target.files?.[0], changeLines)}
      />
    </div>
  );
};

export default ChooseFilePanel;
