import { FC } from 'react';
import { ToggleViewOptionType } from '../../../../stores/view';

interface ViewOptionProps {
  name: 'Orthographic' | 'Grid' | 'Axes';
  checked: boolean;
  toggle: ToggleViewOptionType;
}

const ViewOption: FC<ViewOptionProps> = ({ name, checked, toggle }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input type='checkbox' name={name} checked={checked} onChange={toggle} />
    </div>
  );
};

export default ViewOption;
