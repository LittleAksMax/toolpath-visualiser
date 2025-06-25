import { FC } from 'react';
import { useGCodeStore } from '../../../stores/code';
import LoC from './LoC';
import './GCodePreviewer.css';

const GCodePreviewer: FC = () => {
  const { gcodeLines } = useGCodeStore();

  // TODO: button implementations
  return (
    <div className='preview'>
      <div className='preview-head'>
        <span className='preview-heading'>GCode Preview</span>
        <button>Edit</button>
        <button disabled>Cancel</button>
      </div>
      <div className='code-container'>
        {gcodeLines.map((line, idx) => (
          <LoC key={idx} lineNo={idx} line={line} />
        ))}
      </div>
    </div>
  );
};

export default GCodePreviewer;
