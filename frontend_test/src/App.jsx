import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { Comments, Header, Projects, Tasks, Users } from './components/index';
import styles from './styles.module.css';

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route
          path={'/'}
          element={<h1>Веб-приложение для мониторинга выполнения учебных проектов в вузе</h1>}
        />
        <Route path={'/users'} element={<Users />} />
        <Route path={'/projects'} element={<Projects />} />
        <Route path={'/tasks'} element={<Tasks />} />
        <Route path={'/comments'} element={<Comments />} />
        <Route path={'*'} element={<h1>Хорош хуйней страдать</h1>} />
      </Routes>
    </div>
  );
}

export default App;
