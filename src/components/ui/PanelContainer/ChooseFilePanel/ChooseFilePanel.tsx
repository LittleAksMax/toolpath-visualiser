import { FC } from 'react';
import { useGCodeStore } from '../../../../stores/code';
import { readCodeFile } from './codeReadUtil';

const ChooseFilePanel: FC = () => {
  const { changeCode } = useGCodeStore();
  return (
    <div>
      <input
        type='file'
        accept='.gcode'
        onChange={(e) => readCodeFile(e.target.files?.[0], changeCode)}
      />
    </div>
  );
};

export default ChooseFilePanel;
