import { FC } from 'react';
import { SetRadiusType } from '../../../../stores/machining';

interface RadiusOptionProps {
  radius: number;
  setRadius: SetRadiusType;
}

const RadiusOption: FC<RadiusOptionProps> = ({ radius, setRadius }) => {
  return (
    <div>
      <label htmlFor='radius'>Radius</label>
      <input
        name='radius'
        type='number'
        onChange={(e) => setRadius(parseInt(e.target.value))}
        value={radius}
      />
    </div>
  );
};

export default RadiusOption;
