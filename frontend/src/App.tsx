import './view/theme/index.scss';

import { useEffect } from 'react';

import { ProjectsApi, TasksApi } from '@api';
import { useStores } from '@control';
import { InitialLayout } from '@layouts/initial';
import { LoginLayout } from '@layouts/login';

const App = () => {
  const { user } = useStores();
  const { info } = user;

  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();

  useEffect(() => {
    projectsApi.getList();
    tasksApi.getList();

    user.getAllUsers();
  }, []);

  const currentLayout = () => {
    switch (true) {
      case !info.id.length:
        return <LoginLayout />;

      default:
        return <InitialLayout />;
    }
  };

  return currentLayout();
};

export default App;
