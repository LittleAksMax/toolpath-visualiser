import { FC, useState } from 'react';
import LoC from './LoC';
import './GCodePreviewer.css';
import { useGCodeFile } from '../../../stores/code';

const GCodePreviewer: FC = () => {
  const { lines } = useGCodeFile();
  const [highlighted, setHighlighted] = useState<number | null>(null);
  // TODO: button implementations
  return (
    <div className='preview'>
      <div className='preview-head'>
        <span className='preview-heading'>GCode Preview</span>
        <button>Edit</button>
        <button disabled>Cancel</button>
      </div>
      <div className='code-container'>
        {lines.map((line, idx) => (
          <LoC
            key={idx}
            lineNo={idx}
            line={line}
            highlighted={highlighted === idx}
            highlight={() => setHighlighted(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default GCodePreviewer;
