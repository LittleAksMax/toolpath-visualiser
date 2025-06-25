import { FC } from 'react';
import ViewOption from './ViewOption';
import { useViewStore } from '../../../../stores/view';

const ViewPanel: FC = () => {
  const { ortho, grid, axes, toggleOrtho, toggleGrid, toggleAxes } =
    useViewStore();

  return (
    <div>
      <ViewOption name='Orthographic' checked={ortho} toggle={toggleOrtho} />
      <ViewOption name='Grid' checked={grid} toggle={toggleGrid} />
      <ViewOption name='Axes' checked={axes} toggle={toggleAxes} />
    </div>
  );
};

export default ViewPanel;
