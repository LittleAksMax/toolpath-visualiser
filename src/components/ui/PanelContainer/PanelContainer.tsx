import { FC } from 'react';
import AnimationPanel from './AnimationPanel/AnimationPanel';
import ViewPanel from './ViewPanel/ViewPanel';
// import MachineSettingsPanel from './MachineSettingsPanel/MachineSettingsPanel';
import ChooseFilePanel from './ChooseFilePanel/ChooseFilePanel';
import './PanelContainer.css';

const PanelContainer: FC = () => {
  return (
    <div className='panel-container'>
      <div className='cfp panel'>
        <ChooseFilePanel />
      </div>
      {/* <div className='msp panel'>
        <MachineSettingsPanel />
      </div> */}
      <div className='vp panel'>
        <ViewPanel />
      </div>
      <div className='ap panel'>
        <AnimationPanel />
      </div>
    </div>
  );
};

export default PanelContainer;
