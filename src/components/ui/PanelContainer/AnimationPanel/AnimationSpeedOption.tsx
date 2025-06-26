import { FC } from 'react';
import { useAnimationStore } from '../../../../stores/animation';

/**
 *
 * @deprecated
 */
const AnimationSpeedOption: FC = () => {
  const { animSpeedMul, setAnimSpeedMul } = useAnimationStore();

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
          value={animSpeedMul}
          onChange={(e) => {
            setAnimSpeedMul(parseFloat(e.target.value));
          }}
        />
        <span>&times;{animSpeedMul}</span>
      </div>
    </div>
  );
};

export default AnimationSpeedOption;
