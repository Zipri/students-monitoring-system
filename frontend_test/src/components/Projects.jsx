import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const URL = 'http://127.0.0.1:5000';

// Функция для генерации случайного названия, описания, даты и статуса для нового проекта
const generateRandomProjectData = () => {
  const randomTitle = `Проект ${Math.floor(Math.random() * 1000)}`;
  const randomDescription = `Описание проекта ${Math.floor(Math.random() * 100)}`;
  const randomDeadline = new Date().toISOString().split('T')[0]; // Генерируем сегодняшнюю дату в формате YYYY-MM-DD
  const statuses = ['В процессе', 'Завершен', 'Отложен'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    title: randomTitle,
    description: randomDescription,
    deadline: randomDeadline,
    status: randomStatus,
  };
};

// Функция для генерации случайных данных для обновления существующего проекта
const generateRandomUpdateData = () => {
  const randomDescription = `Описание ${Math.floor(Math.random() * 100)}`;
  const randomDeadline = new Date(
    new Date().getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split('T')[0]; // Генерируем случайную будущую дату
  const statuses = ['В процессе', 'Завершен', 'Отложен'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    description: randomDescription,
    deadline: randomDeadline,
    status: randomStatus,
  };
};

const Projects = () => {
  // Состояния для добавления нового проекта
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
    status: '',
    assignedStudents: [],
    assignedTeacher: '',
  });

  // Состояние для обновления проекта
  const [updateData, setUpdateData] = useState({
    id: '',
    title: '',
    description: '',
    deadline: '',
    status: '',
    assignedStudents: [],
    assignedTeacher: '',
  });

  // Список всех проектов
  const [projects, setProjects] = useState([]);

  // Эндпоинт для получения проектов по названию, дате или статусу
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('');
  const [searchedProjects, setSearchedProjects] = useState([]);

  const searchProjects = async () => {
    const params = new URLSearchParams();

    if (title) params.append('title', title);
    if (deadline) params.append('deadline', deadline);
    if (status) params.append('status', status);

    try {
      const response = await axios.get(`http://127.0.0.1:5000/projects/search?${params}`);
      setSearchedProjects(response.data);
    } catch (error) {
      console.error('Ошибка при получении проектов:', error);
    }
  };

  // Получение списка всех проектов
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка проектов:', error);
    }
  };

  // Добавление нового проекта
  const addProject = async () => {
    try {
      await axios.post(`${URL}/projects/add`, newProject);
      setNewProject({
        title: '',
        description: '',
        deadline: '',
        status: '',
        assignedStudents: [],
        assignedTeacher: '',
      });
      fetchProjects();
    } catch (error) {
      console.error('Ошибка при добавлении проекта:', error);
    }
  };

  // Обновление данных проекта
  const updateProject = async () => {
    const { id, ...data } = updateData;
    try {
      await axios.put(`${URL}/projects/update/${id}`, data);
      setUpdateData({
        id: '',
        title: '',
        description: '',
        deadline: '',
        status: '',
        assignedStudents: [],
        assignedTeacher: '',
      });
      fetchProjects();
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
    }
  };

  // Удаление проекта
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${URL}/projects/delete/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className={`${styles.flex_column} ${styles.container}`}>
      <h1 className={styles.header_large}>Управление проектами</h1>

      <div className={`${styles.flex} ${styles.flex_between}`}>
        <div
          className={`${styles.flex_column} ${styles.flex_gap_medium}`}
          style={{ width: '25rem' }}
        >
          <div className={styles.header_medium}>Добавить новый проект</div>
          <input
            className={styles.input}
            type="text"
            placeholder="Название проекта"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Описание"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input
            className={styles.input}
            type="date"
            placeholder="Срок сдачи"
            value={newProject.deadline}
            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Статус"
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          />
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <button
              onClick={() => setNewProject(generateRandomProjectData())}
              className={styles.btn_main}
            >
              Сгенерировать
            </button>
            <button onClick={addProject} className={styles.btn_second}>
              Добавить проект
            </button>
          </div>
        </div>

        <div
          className={`${styles.flex_column} ${styles.flex_gap_medium}`}
          style={{ width: '25rem' }}
        >
          <div className={styles.header_medium}>Обновить проект</div>
          <input
            className={styles.input}
            type="text"
            placeholder="ID проекта"
            value={updateData.id}
            onChange={(e) => setUpdateData({ ...updateData, id: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Название проекта"
            value={updateData.title}
            onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Описание"
            value={updateData.description}
            onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
          />
          <input
            className={styles.input}
            type="date"
            placeholder="Срок сдачи"
            value={updateData.deadline}
            onChange={(e) => setUpdateData({ ...updateData, deadline: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Статус"
            value={updateData.status}
            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
          />
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <button
              onClick={() => setUpdateData({ ...updateData, ...generateRandomUpdateData() })}
              className={styles.btn_main}
            >
              Сгенерировать
            </button>
            <button onClick={() => updateProject(updateData.id)} className={styles.btn_second}>
              Обновить проект
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.flex_column} ${styles.flex_gap_medium}`} style={{ width: '35rem' }}>
        <div className={styles.header_medium}>Поиск проектов</div>
        <div className={`${styles.flex} ${styles.flex_gap_medium}`} style={{ width: '80vw' }}>
          <input
            className={styles.input}
            type="text"
            placeholder="Название проекта"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={styles.input}
            type="date"
            placeholder="Срок сдачи"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" defaultValue disabled hidden>
              Выберите статус
            </option>
            <option value="В процессе">В процессе</option>
            <option value="Завершен">Завершен</option>
            <option value="Отложен">Отложен</option>
          </select>
          <button
            onClick={() => {
              setStatus('');
              setDeadline('');
              setTitle('');
            }}
            className={styles.btn_danger}
          >
            x
          </button>
          <button onClick={searchProjects} className={styles.btn_empty} style={{ width: '5rem' }}>
            Поиск
          </button>
        </div>
        <div className={`${styles.flex_column} ${styles.list}`} style={{ width: '86vw' }}>
          {searchedProjects.map((project) => (
            <div key={project.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
              <p className={styles.italic}>{project.id}:</p>
              <p>{project.title}</p>
              <p>{project.description}</p>
              <p>{project.deadline}</p>
              <p>{project.status}</p>
              <button onClick={() => deleteProject(project.id)} className={styles.btn_danger}>
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.flex_column} ${styles.flex_gap_medium}`} style={{ width: '35rem' }}>
        <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
          <div className={styles.header_medium}>Список проектов</div>
          <button onClick={fetchProjects} className={styles.btn_empty} style={{ width: '15rem' }}>
            Загрузить элементы
          </button>
        </div>
        <div className={`${styles.flex_column} ${styles.list}`} style={{ width: '86vw' }}>
          {projects.map((project) => (
            <div key={project.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
              <p className={styles.italic}>{project.id}:</p>
              <p>{project.title}</p>
              <p>{project.description}</p>
              <p>{project.deadline}</p>
              <p>{project.status}</p>
              <button onClick={() => deleteProject(project.id)} className={styles.btn_danger}>
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
