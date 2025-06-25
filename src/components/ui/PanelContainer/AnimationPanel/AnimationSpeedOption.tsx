import { FC } from 'react';
import { SetAnimationSpeedMultiplierType } from '../../../../stores/animation';

interface AnimationSpeedOptionProps {
  speed: number;
  setSpeed: SetAnimationSpeedMultiplierType;
}

const AnimationSpeedOption: FC<AnimationSpeedOptionProps> = ({
  speed,
  setSpeed,
}) => {
  return (
    <div>
      <div>
        <label htmlFor='speed'>Animation speed</label>
        <input
          name='speed'
          type='range'
          min={0.1}
          max={20}
          step={0.1}
          value={speed}
          onChange={(e) => {
            setSpeed(parseFloat(e.target.value));
          }}
        />
        <span>&times;{speed}</span>
      </div>
    </div>
  );
};

export default AnimationSpeedOption;
