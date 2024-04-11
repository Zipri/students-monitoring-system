import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '@control';
import { ProjectFiltersWithUrl } from '@view/pieces';

import { TimelineTasksPart } from './timeline';

const TimelineTasks = () => {
  const {
    timelineTasks: { projectTasks, reset, getProjectTasks },
  } = useStores();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="w-full h-full flex gap-2">
      <ProjectFiltersWithUrl updateDataCallback={getProjectTasks} />
      {!!projectTasks.length && <TimelineTasksPart />}
    </div>
  );
};

export default observer(TimelineTasks);
