import { useEffect, useState } from 'react';

import { ProjectsApi, TasksApi } from '@api';

const App = () => {
  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();

  useEffect(() => {
    projectsApi.getList();
    tasksApi.getList();
  }, []);

  return <>Hello dolbaeb</>;
};

export default App;
