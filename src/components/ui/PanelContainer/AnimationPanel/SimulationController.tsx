import { FC } from 'react';
import './SimulationController.css';
import { useCursor } from '../../../../stores/code';
import { useCoords } from '../../../../stores/coords';

interface SimulationControllerProps {}

const SimulationController: FC<SimulationControllerProps> = () => {
  const { sim, toggleSim, line, resetLine, nextLine, maxLine } = useCursor();
  const { reset } = useCoords();

  return (
    <div className='simcontrol'>
      <button onClick={toggleSim}>{sim ? 'Pause' : 'Play'}</button>
      <span>{line}</span>
      <button onClick={nextLine} disabled={maxLine === line}>
        &rsaquo;
      </button>
      <button
        onClick={() => {
          resetLine(); // reset as required
          reset();
          if (sim) toggleSim(); // stop simulation if playing
        }}
        disabled={line === 0}
      >
        Reset
      </button>
    </div>
  );
};

export default SimulationController;
