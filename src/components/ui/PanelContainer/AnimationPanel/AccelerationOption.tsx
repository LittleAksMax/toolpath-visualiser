import { FC } from 'react';
import { useAnimationStore } from '../../../../stores/animation';

interface AccelerationOptionType {}

const AccelerationOption: FC<AccelerationOptionType> = () => {
  const { accel, setAccel } = useAnimationStore();
  return (
    <div>
      <label htmlFor='accel'>Machine acceleration, units/s^2</label>
      <input
        name='accel'
        type='number'
        value={accel}
        onChange={(e) => {
          setAccel(parseInt(e.target.value));
        }}
      />
    </div>
  );
};

export default AccelerationOption;
