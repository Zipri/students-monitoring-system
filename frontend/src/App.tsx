import { useEffect } from 'react';

import { ProjectsApi, TasksApi } from '@api';
import { useStores } from '@control';

const App = () => {
  const { user } = useStores();

  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();

  useEffect(() => {
    projectsApi.getList();
    tasksApi.getList();

    user.getAllUsers();
  }, []);

  return <>Hello dolbaeb</>;
};

export default App;
