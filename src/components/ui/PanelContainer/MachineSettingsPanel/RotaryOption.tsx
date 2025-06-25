import { FC } from 'react';
import {
  RotaryType,
  rotaryTypes,
  SetRotaryType,
} from '../../../../stores/machining';

interface RotaryOptionProps {
  rotary: RotaryType;
  setRotary: SetRotaryType;
}

const RotaryOption: FC<RotaryOptionProps> = ({ rotary, setRotary }) => {
  return (
    <div>
      <label htmlFor='rotary'>Rotary</label>
      <select
        onChange={(e) => setRotary(e.target.value as RotaryType)}
        defaultValue={rotary}
      >
        {rotaryTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RotaryOption;
