import { FC } from 'react';
import { useAnimationStore } from '../../../../stores/animation';
import AccelerationOption from './AccelerationOption';
import AnimationSpeedOption from './AnimationSpeedOption';

const AnimationPanel: FC = () => {
  const { accel, setAccel, animSpeedMul, setAnimSpeedMul } =
    useAnimationStore();
  return (
    <div>
      <AccelerationOption acceleration={accel} setAcceleration={setAccel} />
      <AnimationSpeedOption speed={animSpeedMul} setSpeed={setAnimSpeedMul} />
    </div>
  );
};

export default AnimationPanel;
