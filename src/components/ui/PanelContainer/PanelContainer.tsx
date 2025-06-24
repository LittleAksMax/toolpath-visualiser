import { FC } from 'react';
import AnimationPanel from './AnimationPanel/AnimationPanel';
import ViewPanel from './ViewPanel/ViewPanel';
import MachineTimePanel from './MachineTimePanel/MachineTimePanel';
import ChooseFilePanel from './ChooseFilePanel/ChooseFilePanel';

const PanelContainer: FC = () => {
  return (
    <div>
      <ChooseFilePanel />
      <MachineTimePanel />
      <ViewPanel />
      <AnimationPanel />
    </div>
  );
};

export default PanelContainer;
