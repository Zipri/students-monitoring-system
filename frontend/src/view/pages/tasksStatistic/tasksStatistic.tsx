import { useStores } from '@control';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

const TasksStatistic = () => {
  const { tasksStatistic } = useStores();
  const { getProjectsIds, searchTasks, reset } = tasksStatistic;

  useEffect(() => {
    getProjectsIds();

    return () => reset();
  }, []);

  return <div></div>;
};

export default observer(TasksStatistic);
