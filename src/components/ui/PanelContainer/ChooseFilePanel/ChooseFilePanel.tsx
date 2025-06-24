import { FC } from 'react';
import { useGCodeStore } from '../../../../stores/code';

const ChooseFilePanel: FC = () => {
  const { changeCode } = useGCodeStore();
  return (
    <div>
      <input type='file' onChange={changeCode} />
    </div>
  );
};

export default ChooseFilePanel;
