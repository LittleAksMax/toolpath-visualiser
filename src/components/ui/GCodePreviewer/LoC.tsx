import { FC } from 'react';
import './LoC.css';

interface LoCProps {
  lineNo: number;
  line: string;
  highlighted: boolean;
  highlight: () => void;
}

const LoC: FC<LoCProps> = ({ lineNo, line, highlighted, highlight }) => {
  // only commands that start with 'G' are 'moves'
  // unactionable => red, actionable => orange
  const actionable = line.charAt(0) === 'G';

  const locClass = () =>
    'loc' +
    (!highlighted
      ? ''
      : ' ' + (actionable ? 'highlighted-act' : 'highlighted-unact'));

  return (
    <code className={locClass()} onClick={highlight}>
      <span className='lineno'>[{lineNo}]</span>
      &nbsp;
      <span className='line'>{line}</span>
    </code>
  );
};

export default LoC;
