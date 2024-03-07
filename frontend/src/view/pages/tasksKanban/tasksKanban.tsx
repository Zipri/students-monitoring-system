import { observer } from 'mobx-react-lite';

import { TasksKanbanPart } from './kanban';
import { TasksProjectFilters } from './projectFilters';
import { useStores } from '@control';
import { useEffect } from 'react';

const TasksKanban = () => {
  const {
    tasksKanban: { reset },
  } = useStores();

  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="w-full h-full flex gap-2">
      <TasksProjectFilters />
      <TasksKanbanPart />
    </div>
  );
};

export default observer(TasksKanban);
