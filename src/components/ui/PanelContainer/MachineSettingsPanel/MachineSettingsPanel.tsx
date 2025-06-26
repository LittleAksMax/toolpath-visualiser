import { FC } from 'react';
import RotaryOption from './RotaryOption';
import RadiusOption from './RadiusOption';
import MachineTime from './MachineTime';
import { useMachiningStore } from '../../../../stores/machining';

/**
 * @deprecated We are no longer taking these as inputs
 */
const MachineSettingsPanel: FC = () => {
  const { rot, setRot, rad, setRad } = useMachiningStore();

  return (
    <div>
      <MachineTime />
      <RotaryOption rotary={rot} setRotary={setRot} />
      <RadiusOption radius={rad} setRadius={setRad} />
    </div>
  );
};

export default MachineSettingsPanel;
