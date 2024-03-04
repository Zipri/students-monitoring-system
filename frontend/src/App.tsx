import './App.css';

import { useEffect, useState } from 'react';

import viteLogo from '/vite.svg';

import { ProjectsApi, TasksApi } from '@api';

import reactLogo from './assets/react.svg';

const App = () => {
  const [count, setCount] = useState(0);

  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();

  useEffect(() => {
    projectsApi.getList();
    tasksApi.getList();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR! It's Working
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
