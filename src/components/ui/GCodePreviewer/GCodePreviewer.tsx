import { FC } from 'react';
import { useGCodeStore } from '../../../stores/code';
import LoC from './LoC';
import './GCodePreviewer.css';

const GCodePreviewer: FC = () => {
  const { gcodeLines } = useGCodeStore();

  return (
    <div className='code-container'>
      {gcodeLines.map((line, idx) => (
        <LoC key={idx} lineNo={idx} line={line} />
      ))}
    </div>
  );
};

export default GCodePreviewer;
