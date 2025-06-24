import { FC } from 'react';

interface LoCProps {
  lineNo: number;
  line: string;
}

const LoC: FC<LoCProps> = ({ lineNo, line }) => {
  return (
    <span>
      <span>[{lineNo}]</span>
      <span>{line}</span>
    </span>
  );
};

export default LoC;
