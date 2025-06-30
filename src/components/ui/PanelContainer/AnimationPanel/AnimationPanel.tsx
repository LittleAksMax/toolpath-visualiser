import { FC } from 'react';
// import AccelerationOption from './AccelerationOption';
// import AnimationSpeedOption from './AnimationSpeedOption';
import SimulationController from './SimulationController';

const AnimationPanel: FC = () => {
  return (
    <div>
      {/* <AccelerationOption /> */}
      <SimulationController />
      {/* <AnimationSpeedOption /> */}
    </div>
  );
};

export default AnimationPanel;
