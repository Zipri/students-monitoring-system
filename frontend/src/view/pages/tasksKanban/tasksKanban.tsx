import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '@control';
import { ProjectFiltersWithUrl } from '@view/pieces';

import { TasksKanbanPart } from './kanban';

const TasksKanban = () => {
  const {
    tasksKanban: { reset, getProjectTasks },
  } = useStores();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="w-full h-full flex gap-2">
      <ProjectFiltersWithUrl updateDataCallback={getProjectTasks} />
      <TasksKanbanPart />
    </div>
  );
};

export default observer(TasksKanban);
