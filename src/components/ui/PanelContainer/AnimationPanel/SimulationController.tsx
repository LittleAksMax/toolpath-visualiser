import { FC } from 'react';
import './SimulationController.css';
import { useCursor } from '../../../../stores/code';

interface SimulationControllerProps {}

const SimulationController: FC<SimulationControllerProps> = () => {
  const { line, resetLine, nextLine, maxLine } = useCursor();

  return (
    <div className='simcontrol'>
      <span>{line}</span>
      <button onClick={nextLine} disabled={maxLine === line}>
        &rsaquo;
      </button>
      <button onClick={resetLine} disabled={line === 0}>
        Reset
      </button>
    </div>
  );
};

export default SimulationController;
