import { FC } from 'react';
import './App.css';
import PanelContainer from './components/ui/PanelContainer/PanelContainer';
import Visualisation from './components/ui/Visualisation/Visualisation';
import GCodePreviewer from './components/ui/GCodePreviewer/GCodePreviewer';

const App: FC = () => {
  return (
    <div className='App'>
      <PanelContainer />
      <Visualisation />
      <GCodePreviewer />
    </div>
  );
};

export default App;
