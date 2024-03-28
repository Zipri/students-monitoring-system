import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

import { TasksStatisticTable } from './table';
import { TasksStatisticFilters } from './filters';

const TasksStatistic = () => {
  const { tasksStatistic } = useStores();
  const { getProjectsIds, reset } = tasksStatistic;

  useEffect(() => {
    getProjectsIds();

    return () => reset();
  }, []);

  return (
    <div className="flex flex-column gap-2">
      <TasksStatisticFilters />
      <TasksStatisticTable />
    </div>
  );
};

export default observer(TasksStatistic);
