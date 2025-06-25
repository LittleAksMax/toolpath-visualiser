import { FC } from 'react';
import { useCoordStore } from '../../../../stores/coords';
import Coordinate from './Coordinate';
import './Coordinates.css';

const Coordinates: FC = () => {
  const { x, y, z } = useCoordStore();

  return (
    <div className='coords'>
      <Coordinate axis='X' val={x} />
      <Coordinate axis='Y' val={y} />
      <Coordinate axis='Z' val={z} />
    </div>
  );
};

export default Coordinates;
