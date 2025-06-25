import { FC } from 'react';
import { ToggleSimulationType } from '../../../../stores/animation';

interface SimulationControllerProps {
  simulationPlaying: boolean;
  toggleSimulation: ToggleSimulationType;
}

const SimulationController: FC<SimulationControllerProps> = ({
  simulationPlaying,
  toggleSimulation,
}) => {
  return (
    <div>
      <button onClick={toggleSimulation}>
        {simulationPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default SimulationController;
