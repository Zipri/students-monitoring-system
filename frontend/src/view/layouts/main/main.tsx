import { observer } from 'mobx-react-lite';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CustomToast } from '@view/common/toast';
import { Projects } from '@view/pages';
import { NavigationMenu, TopBar } from '@view/pieces';

import styles from './styles.module.scss';

const MainLayout = () => {
  return (
    <BrowserRouter>
      <CustomToast />
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
            <Route path="/projects" element={<Projects />} />
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
