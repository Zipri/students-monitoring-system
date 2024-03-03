import React, { useEffect, useState } from 'react';

import axios from 'axios';

import styles from './styles.module.css';

const baseURL = 'http://127.0.0.1:5000';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('');
  const [newTask, setNewTask] = useState({
    projectId: '',
    title: '',
    description: '',
    status: '',
    priority: '',
    deadline: '',
  });

  // ## Обновление данных задачи по идентификатору
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    deadline: '',
  });

  // ## Список всех проектов
  const [projects, setProjects] = useState([]);

  // ## фильтровать задачи (tasks) по всем предоставленным параметрам
  const [filterParams, setFilterParams] = useState({
    id: '',
    projectId: '',
    title: '',
    description: '',
    status: '',
    priority: '',
    deadline: '',
  });

  // Получение списка всех проектов
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка проектов:', error);
    }
  };

  // Получение всех задач
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
    }
  };

  // Получение всех задач
  const filterTasks = async () => {
    try {
      const nonEmptyParams = Object.entries(filterParams).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await axios.get(`${baseURL}/tasks/filter`, { params: nonEmptyParams });
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при фильтрации задач:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
  };

  // Добавление новой задачи
  const addTask = async () => {
    try {
      if (!newTask.projectId) {
        alert('Нужен ID проекта');
        return;
      }
      const response = await axios.post(`${baseURL}/tasks/add`, newTask);
      console.log('Задача добавлена:', response.data);
      fetchTasks(); // Перезагрузка списка задач
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error);
    }
  };

  // Обновление задачи
  const updateTask = async () => {
    try {
      const response = await axios.put(`${baseURL}/tasks/update/${editingTaskId}`, editingTaskData);
      console.log('Задача обновлена:', response.data);
      fetchTasks(); // Перезагрузка списка задач
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/tasks/delete/${id}`);
      console.log('Задача удалена:', response.data);
      fetchTasks(); // Перезагрузка списка задач
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  // Получение задач по идентификатору проекта
  const fetchTasksByProjectId = async (projectId) => {
    try {
      const response = await axios.get(`${baseURL}/tasks/project/${projectId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при фильтрации задач по проекту:', error);
    }
  };

  // Фильтрация задач по статусу
  const fetchTasksByStatus = async (status) => {
    try {
      const response = await axios.get(`${baseURL}/tasks/status/${status}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при фильтрации задач по статусу:', error);
    }
  };

  const generateTaskData = () => {
    const titles = ['Исследование', 'Разработка', 'Тестирование'];
    const descriptions = ['Описание задачи 1', 'Описание задачи 2', 'Описание задачи 3'];
    const statuses = ['новая', 'в работе', 'завершена'];
    const priorities = ['низкий', 'средний', 'высокий'];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomDeadline = new Date(
      new Date().getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split('T')[0];

    setNewTask({
      ...newTask,
      title: randomTitle,
      description: randomDescription,
      status: randomStatus,
      priority: randomPriority,
      deadline: randomDeadline,
    });
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  return (
    <div className={`${styles.flex_column} ${styles.container}`}>
      {/* <h1 className={styles.header_large}>Управление задачами</h1> */}

      <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
        <div
          className={`${styles.flex_column} ${styles.flex_gap_small}`}
          style={{ width: '25rem' }}
        >
          <div className={styles.header_medium}>Добавить новую задачу</div>
          <form
            className={`${styles.flex_column} ${styles.flex_gap_medium}`}
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
          >
            <input
              className={styles.input}
              type="text"
              placeholder="ID проекта"
              value={newTask.projectId}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Название"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Описание"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              className={styles.input}
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="" defaultValue disabled hidden>
                Выберите статус
              </option>
              <option value="новая">Новая</option>
              <option value="в работе">В работе</option>
              <option value="завершена">Завершена</option>
            </select>
            <input
              className={styles.input}
              type="text"
              placeholder="Приоритет"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            />
            <input
              className={styles.input}
              type="date"
              placeholder="Дедлайн"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
            <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
              <button className={styles.btn_main} onClick={generateTaskData} type="button">
                Сгенерировать данные
              </button>
              <button className={styles.btn_second} type="submit">
                Добавить задачу
              </button>
            </div>
          </form>
        </div>
        <div
          className={`${styles.flex_column} ${styles.flex_gap_small}`}
          style={{ width: '35rem', height: '23rem' }}
        >
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <div className={styles.header_medium}>Список проектов</div>
            <button onClick={fetchProjects} className={styles.btn_empty} style={{ width: '15rem' }}>
              Загрузить элементы
            </button>
          </div>
          <div className={`${styles.flex_column} ${styles.list}`} style={{ width: '35rem' }}>
            {projects.map((project) => (
              <div key={project.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
                <p className={styles.italic}>{project.id}:</p>
                <p>{project.title}</p>
                <p>{project.description}</p>
                <p>{project.deadline}</p>
                <p>{project.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
        <div className={styles.header_medium}>Фильтры</div>
        <div className={`${styles.flex} ${styles.flex_gap_small}`}>
          <input
            className={styles.input}
            type="text"
            placeholder="ID проекта"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <button className={styles.btn_main} onClick={() => fetchTasksByProjectId(projectId)}>
            Фильтровать по проекту
          </button>
        </div>
        <div className={`${styles.flex} ${styles.flex_gap_small}`}>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" defaultValue disabled hidden>
              Выберите статус
            </option>
            <option value="новая">Новая</option>
            <option value="в работе">В работе</option>
            <option value="завершена">Завершена</option>
          </select>
          <button className={styles.btn_main} onClick={() => fetchTasksByStatus(status)}>
            Фильтровать по статусу
          </button>
        </div>
      </div>

      <div className={`${styles.flex_column} ${styles.flex_gap_small}`}>
        <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
          <input
            className={styles.input}
            name="id"
            value={filterParams.id}
            onChange={handleFilterChange}
            placeholder="ID задачи"
          />
          <input
            className={styles.input}
            name="projectId"
            value={filterParams.projectId}
            onChange={handleFilterChange}
            placeholder="ID проекта"
          />
          <input
            className={styles.input}
            name="title"
            value={filterParams.title}
            onChange={handleFilterChange}
            placeholder="Название"
          />
          <input
            className={styles.input}
            name="description"
            value={filterParams.description}
            onChange={handleFilterChange}
            placeholder="Описание"
          />
        </div>
        <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
          <select
            className={styles.input}
            value={filterParams.status}
            onChange={(e) => setFilterParams({ ...filterParams, status: e.target.value })}
          >
            <option value="" defaultValue disabled hidden>
              Выберите статус
            </option>
            <option value="новая">Новая</option>
            <option value="в работе">В работе</option>
            <option value="завершена">Завершена</option>
          </select>
          <input
            className={styles.input}
            name="priority"
            value={filterParams.priority}
            onChange={handleFilterChange}
            placeholder="Приоритет"
          />
          <input
            className={styles.input}
            type="date"
            name="deadline"
            value={filterParams.deadline}
            onChange={handleFilterChange}
            placeholder="Дедлайн"
          />
          <button className={styles.btn_main} onClick={filterTasks}>
            Фильтровать
          </button>
          <button
            className={styles.btn_danger}
            onClick={() => {
              setFilterParams({
                id: '',
                projectId: '',
                title: '',
                description: '',
                status: '',
                priority: '',
                deadline: '',
              });
              fetchTasks();
            }}
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className={`${styles.flex_column} ${styles.flex_gap_medium}`} style={{ width: '35rem' }}>
        <div
          className={`${styles.flex_column} ${styles.list}`}
          style={{ width: '86vw', height: '17rem' }}
        >
          {tasks.map((task) => (
            <div key={task.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
              {editingTaskId === task.id ? (
                <>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Название"
                    value={editingTaskData.title}
                    onChange={(e) =>
                      setEditingTaskData({ ...editingTaskData, title: e.target.value })
                    }
                  />
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Описание"
                    value={editingTaskData.description}
                    onChange={(e) =>
                      setEditingTaskData({ ...editingTaskData, description: e.target.value })
                    }
                  />
                  <select
                    className={styles.input}
                    value={editingTaskData.status}
                    onChange={(e) =>
                      setEditingTaskData({ ...editingTaskData, status: e.target.value })
                    }
                  >
                    <option value="" defaultValue disabled hidden>
                      Выберите статус
                    </option>
                    <option value="новая">Новая</option>
                    <option value="в работе">В работе</option>
                    <option value="завершена">Завершена</option>
                  </select>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Приоритет"
                    value={editingTaskData.priority}
                    onChange={(e) =>
                      setEditingTaskData({ ...editingTaskData, priority: e.target.value })
                    }
                  />
                  <button
                    onClick={() => {
                      setEditingTaskId('');
                      updateTask();
                    }}
                    className={styles.btn_second}
                  >
                    V
                  </button>
                </>
              ) : (
                <>
                  <p className={styles.italic}>{task.id}:</p>
                  <p>{task.title}</p>
                  <p>{task.description}</p>
                  <p>{task.status}</p>
                  <p>{task.priority}</p>
                  <p>{task.deadline}</p>
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskData({
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        deadline: task.deadline,
                      });
                    }}
                    className={styles.btn_main}
                  >
                    /
                  </button>
                </>
              )}

              <button onClick={() => deleteTask(task.id)} className={styles.btn_danger}>
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
