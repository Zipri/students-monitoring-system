import './view/theme/index.scss';

import { useEffect } from 'react';

import { configure, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import { ProjectsApi, TasksApi } from '@api';
import { useStores } from '@control';
import { InitialLayout } from '@layouts/initial';
import { LoginLayout } from '@layouts/login';
import { MainLayout } from '@layouts/main';

//настройка для того, чтобы MobX не показывал предупреждения о
//том, что экшены не могут быть асинхронными (могут, это легаси)
configure({
  enforceActions: 'never',
});

const App = () => {
  const { user } = useStores();
  const { info } = user;

  const currentLayout = () => {
    switch (true) {
      case !info.id.length:
        return <LoginLayout />;

      case !!info.id.length:
        return <MainLayout />;

      default:
        return <InitialLayout />;
    }
  };

  return currentLayout();
};

export default observer(App);
