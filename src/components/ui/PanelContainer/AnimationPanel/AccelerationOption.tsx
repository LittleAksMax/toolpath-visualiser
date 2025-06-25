import { FC } from 'react';
import { SetAccelerationType } from '../../../../stores/animation';

interface AccelerationOptionType {
  acceleration: number;
  setAcceleration: SetAccelerationType;
}

const AccelerationOption: FC<AccelerationOptionType> = ({
  acceleration,
  setAcceleration,
}) => {
  return (
    <div>
      <label htmlFor='accel'>Machine acceleration, units/s^2</label>
      <input
        name='accel'
        type='number'
        value={acceleration}
        onChange={(e) => {
          setAcceleration(parseInt(e.target.value));
        }}
      />
    </div>
  );
};

export default AccelerationOption;
