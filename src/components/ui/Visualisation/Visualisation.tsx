import { FC } from 'react';
import Coordinates from './Coordinates/Coordinates';
import Orientation from './Orientation/Orientation';
import Render from './Render/Render';

const Visualisation: FC = () => {
  return (
    <div>
      <Render />
      <Coordinates />
      <Orientation />
    </div>
  );
};

export default Visualisation;
