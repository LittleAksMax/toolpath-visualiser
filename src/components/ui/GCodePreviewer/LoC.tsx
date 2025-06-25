import { FC } from 'react';
import './LoC.css';

interface LoCProps {
  lineNo: number;
  line: string;
}

const LoC: FC<LoCProps> = ({ lineNo, line }) => {
  return (
    <code className='loc'>
      <span className='lineno'>[{lineNo}]</span>
      &nbsp;
      <span className='line'>{line}</span>
    </code>
  );
};

export default LoC;
