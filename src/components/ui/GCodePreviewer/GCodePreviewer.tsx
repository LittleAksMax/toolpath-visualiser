import { FC, useEffect, useState } from 'react';
import LoC from './LoC';
import './GCodePreviewer.css';
import { useCursor, useGCodeFile } from '../../../stores/code';

const GCodePreviewer: FC = () => {
  const { lines } = useGCodeFile();
  const { sim, line } = useCursor();
  const [highlighted, setHighlighted] = useState<number | null>(null);

  // in active simulations, we want to set the
  useEffect(() => {
    if (sim) {
      setHighlighted(line);
    }
  }, [sim, line]);

  return (
    <div className='preview'>
      <div className='preview-head'>
        <span className='preview-heading'>GCode Preview</span>
      </div>
      <div className='code-container'>
        {lines.map((codeLine, idx) => (
          <LoC
            key={idx}
            lineNo={idx}
            line={codeLine}
            highlighted={highlighted === idx}
            highlight={() => setHighlighted(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default GCodePreviewer;
