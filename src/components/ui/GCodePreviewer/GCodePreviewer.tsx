import { FC } from 'react';
import { useGCodeStore } from '../../../stores/code';
import LoC from './LoC';

const GCodePreviewer: FC = () => {
  const { gcodeLines } = useGCodeStore();

  return (
    <div>
      {gcodeLines.map((line, idx) => (
        <LoC lineNo={idx} line={line} />
      ))}
    </div>
  );
};

export default GCodePreviewer;
