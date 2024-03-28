import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

import { TasksStatisticTable } from './table';

const TasksStatistic = () => {
  const { tasksStatistic } = useStores();
  const { getProjectsIds, reset } = tasksStatistic;

  useEffect(() => {
    getProjectsIds();

    return () => reset();
  }, []);

  return (
    <div>
      <TasksStatisticTable />
    </div>
  );
};

export default observer(TasksStatistic);
