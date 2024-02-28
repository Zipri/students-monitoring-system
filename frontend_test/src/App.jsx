import React from 'react';

import { Route, Routes } from 'react-router-dom';

import {
  CrudCollection,
  Header,
  SecondCrudCollection,
  ThirdCrudCollection,
  Users,
  Projects,
} from './components/index';
import styles from './styles.module.css';

function App() {
  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route path={'/'} element={<h1>Hello dolbaeb</h1>} />
        <Route path={'/users'} element={<Users />} />
        <Route path={'/projects'} element={<Projects />} />
        <Route path={'/crud-collection'} element={<CrudCollection />} />
        <Route path={'/second-crud-collection'} element={<SecondCrudCollection />} />
        <Route path={'/third-crud-collection'} element={<ThirdCrudCollection />} />
        <Route path={'*'} element={<h1>Хорош хуйней страдать</h1>} />
      </Routes>
    </div>
  );
}

export default App;
