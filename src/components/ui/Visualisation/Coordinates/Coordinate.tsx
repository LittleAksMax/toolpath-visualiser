import { FC } from 'react';
import './Coordinate.css';

interface CoordinateProps {
  axis: 'X' | 'Y' | 'Z';
  val: number;
}

const Coordinate: FC<CoordinateProps> = ({ axis, val }: CoordinateProps) => {
  return (
    <div className='coord'>
      <span className='axis'>{axis}</span>
      <span className='coordvalue'>{val.toFixed(5)}</span>
    </div>
  );
};

export default Coordinate;
