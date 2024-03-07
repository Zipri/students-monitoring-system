import { observer } from 'mobx-react-lite';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootModal } from 'view/modals';

import { CustomToast } from '@view/common';
import { Projects, ProjectsKanban, TasksKanban } from '@view/pages';
import { NavigationMenu, TopBar } from '@view/pieces';

import styles from './styles.module.scss';

const MainLayout = () => {
  return (
    <BrowserRouter>
      <CustomToast />
      <RootModal />

      <div className={styles.wrapper}>
        <TopBar />
        <NavigationMenu />

        <div className={styles.content}>
          <Routes>
            {/* <Route
              path="/"
              element={<Navigate replace to="/global-search" />}
            /> */}
            <Route
              path="/"
              element={
                <div className="flex flex-column gap-2">
                  <h1>V EduTrack V</h1>
                </div>
              }
            />
            <Route path="/projects-search" element={<Projects />} />
            <Route path="/projects-kanban" element={<ProjectsKanban />} />
            <Route path="/tasks-kanban" element={<TasksKanban />} />
            <Route
              path="*"
              element={
                <div className="flex flex-column">
                  <h2>404</h2>
                  <h2>Запрошенная страница не найдена</h2>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default observer(MainLayout);
