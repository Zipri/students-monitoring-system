import { observer } from 'mobx-react-lite';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RootModal } from 'view/modals';

import { CustomToast } from '@view/common';
import {
  Projects,
  ProjectsKanban,
  ProjectsStatistic,
  Schedule,
  TasksKanban,
  TasksStatistic,
  TimelineTasks,
  UniSettings,
  UserSettings,
} from '@view/pages';
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
            <Route
              path="/"
              element={<Navigate replace to="/projects-kanban" />}
            />
            <Route path="/uni-settings" element={<UniSettings />} />
            <Route path="/user-settings" element={<UserSettings />} />
            <Route path="/projects-search" element={<Projects />} />
            <Route path="/projects-kanban" element={<ProjectsKanban />} />
            <Route path="/tasks-kanban" element={<TasksKanban />} />
            <Route path="/tasks-timeline" element={<TimelineTasks />} />
            <Route path="/projects-statistic" element={<ProjectsStatistic />} />
            <Route path="/tasks-statistic" element={<TasksStatistic />} />
            <Route path="/schedule" element={<Schedule />} />
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
