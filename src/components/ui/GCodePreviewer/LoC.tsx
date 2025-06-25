import { FC } from 'react';
import './LoC.css';

interface LoCProps {
  lineNo: number;
  line: string;
  highlighted: boolean;
  highlight: () => void;
}

const LoC: FC<LoCProps> = ({ lineNo, line, highlighted, highlight }) => {
  return (
    <code
      className={'loc' + (highlighted ? ' highlighted' : '')}
      onClick={highlight}
    >
      <span className='lineno'>[{lineNo}]</span>
      &nbsp;
      <span className='line'>{line}</span>
    </code>
  );
};

export default LoC;
