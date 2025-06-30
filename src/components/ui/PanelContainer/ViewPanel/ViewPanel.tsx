import { FC } from 'react';
import ViewOption from './ViewOption';
import { useViewStore } from '../../../../stores/view';

const ViewPanel: FC = () => {
  const { grid, axes, toggleGrid, toggleAxes } = useViewStore();

  return (
    <div>
      <ViewOption name='Grid' checked={grid} toggle={toggleGrid} />
      <ViewOption name='Axes' checked={axes} toggle={toggleAxes} />
    </div>
  );
};

export default ViewPanel;
