import { FC } from 'react';
import { useAnimationStore } from '../../../../stores/animation';
import AccelerationOption from './AccelerationOption';
import AnimationSpeedOption from './AnimationSpeedOption';
import SimulationController from './SimulationController';

const AnimationPanel: FC = () => {
  const { accel, setAccel, animSpeedMul, setAnimSpeedMul, sim, toggleSim } =
    useAnimationStore();
  return (
    <div>
      <AccelerationOption acceleration={accel} setAcceleration={setAccel} />
      <SimulationController
        simulationPlaying={sim}
        toggleSimulation={toggleSim}
      />
      <AnimationSpeedOption speed={animSpeedMul} setSpeed={setAnimSpeedMul} />
    </div>
  );
};

export default AnimationPanel;
