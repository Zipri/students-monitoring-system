import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { baseURL } from './constants';
import styles from './styles.module.css';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const EMPTY_DATA = {
  addedUserName: '',
  addedUserEmail: '',
  addedUserRole: '',
  addedUserGroup: '',
  updatedUser: '',
  updatedUserId: '',
};

const EMPTY_EDIT_DATA = {
  username: '',
  email: '',
  role: '',
  group: '',
};

const usersEnum = {
  student: 'Студент',
  teacher: 'Преподаватель',
};

const Users = () => {
  const [userData, setUserData] = useState(EMPTY_DATA);
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState('');
  const [role, setRole] = useState(usersEnum.student);
  const [editingUserId, setEditingUserId] = useState('');
  const [editingUserData, setEditingUserData] = useState(EMPTY_EDIT_DATA);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleGenerate = (role) => {
    // Предопределённые значения
    const names = ['Иван', 'Елена', 'Петр', 'Ольга', 'Дмитрий'];

    // Функция для выбора случайного элемента из массива
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    const addedUserName = getRandomElement(names);
    const addedUserGroup =
      role === usersEnum.teacher
        ? ''
        : `ИУ${getRandomInt(10)}-${getRandomInt(3)}${getRandomInt(10)}Б`;

    setUserData({
      ...userData,
      addedUserName,
      addedUserEmail: `${addedUserName}@mail.ru`,
      addedUserRole: role,
      addedUserGroup,
    });
  };

  const handleGenerateTeacher = () => {
    handleGenerate(usersEnum.teacher);
  };

  const handleGenerateStudent = () => {
    handleGenerate(usersEnum.student);
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditingUserData({
      username: user.username,
      email: user.email,
      role: user.role,
      group: user.group,
    });
  };

  const cancelEditing = () => {
    setEditingUserId('');
    setEditingUserData(EMPTY_EDIT_DATA);
  };

  // Функция для загрузки всех элементов
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${baseURL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // Функция для добавления элемента
  const addItem = async () => {
    const { addedUserName, addedUserEmail, addedUserRole, addedUserGroup } = userData;
    if (!addedUserName) {
      alert('Пожалуйста, введите значение');
      return;
    }
    try {
      await axios.post(`${baseURL}/users/add`, {
        username: addedUserName,
        email: addedUserEmail,
        role: addedUserRole,
        group: addedUserGroup,
      });
      setUserData(EMPTY_DATA);
      fetchItems(); // Перезагрузка элементов после добавления
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  // Функция для удаления элемента
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${baseURL}/users/delete/${id}`);
      getUsersByGroup();
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  };

  // Функция для обновления элемента
  const updateItem = async () => {
    try {
      await axios.put(`${baseURL}/users/update/${editingUserId}`, editingUserData);
      cancelEditing();
      fetchItems(); // Перезагрузка элементов после добавления
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  // Возвращает всех студентов заданной группы
  const getUsersByGroup = async () => {
    try {
      const response = group.length
        ? await axios.get(`${baseURL}/users/group/${group}`)
        : await axios.get(`${baseURL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // Возвращает всех заданной роли
  const getUsersByRole = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/role/${role}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className={`${styles.flex_column}`}>
      {/* Блок добавления пользователя */}
      <div className={`${styles.flex_column}`} style={{ width: '30rem' }}>
        <div className={styles.header_medium}>Добавить пользователя</div>
        <input
          type="text"
          name="addedUserName"
          value={userData.addedUserName}
          onChange={handleInputChange}
          placeholder="Введите имя"
          className={styles.input}
        />
        <input
          type="text"
          name="addedUserEmail"
          value={userData.addedUserEmail}
          onChange={handleInputChange}
          placeholder="Введите Email"
          className={styles.input}
        />
        <input
          type="text"
          name="addedUserRole"
          value={userData.addedUserRole}
          onChange={handleInputChange}
          placeholder="Введите роль"
          className={styles.input}
        />
        <input
          type="text"
          name="addedUserGroup"
          value={userData.addedUserGroup}
          onChange={handleInputChange}
          placeholder="Введите группу"
          className={styles.input}
        />
        <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
          <button onClick={handleGenerateTeacher} className={styles.btn_main}>
            Преподаватель
          </button>
          <button onClick={handleGenerateStudent} className={styles.btn_main}>
            Студент
          </button>
          <button onClick={() => setUserData(EMPTY_DATA)} className={styles.btn_danger}>
            Сбросить
          </button>
          <button onClick={addItem} className={styles.btn_second}>
            Добавить
          </button>
        </div>
      </div>

      {/* Блок получения, обновление и удаления пользователей (и по группе) */}
      <div className={`${styles.flex_column}`}>
        <div className={styles.header_medium}>Список пользователей</div>
        <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <input
              type="text"
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Введите группу"
              className={styles.input}
            />
            <button onClick={getUsersByGroup} className={styles.btn_main}>
              Загрузить по группе
            </button>
          </div>
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <select className={styles.input} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value={usersEnum.student}>Студент</option>
              <option value={usersEnum.teacher}>Преподаватель</option>
            </select>
            <button onClick={getUsersByRole} className={styles.btn_main}>
              Загрузить по роли
            </button>
          </div>
          <button
            onClick={() => {
              setGroup('');
              fetchItems();
            }}
            className={styles.btn_danger}
          >
            x
          </button>
        </div>

        <div
          className={`${styles.flex_column} ${styles.list}`}
          style={{ width: '86vw', height: '17rem' }}
        >
          {users.map((user) => (
            <div key={user.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
              {editingUserId === user.id ? (
                <>
                  <input
                    className={styles.input}
                    value={editingUserData.username}
                    onChange={(e) =>
                      setEditingUserData({ ...editingUserData, username: e.target.value })
                    }
                    placeholder="Имя"
                  />
                  <input
                    className={styles.input}
                    value={editingUserData.email}
                    onChange={(e) =>
                      setEditingUserData({ ...editingUserData, email: e.target.value })
                    }
                    placeholder="Email"
                  />
                  <select
                    className={styles.input}
                    value={editingUserData.role}
                    onChange={(e) =>
                      setEditingUserData({ ...editingUserData, role: e.target.value })
                    }
                  >
                    <option value={usersEnum.student}>Студент</option>
                    <option value={usersEnum.teacher}>Преподаватель</option>
                  </select>
                  {editingUserData.role === usersEnum.student ? (
                    <input
                      className={styles.input}
                      value={editingUserData.group}
                      onChange={(e) =>
                        setEditingUserData({ ...editingUserData, group: e.target.value })
                      }
                      placeholder="Группа"
                    />
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={() => {
                      updateItem();
                      setEditingUserId('');
                    }}
                    className={styles.btn_second}
                  >
                    V
                  </button>
                  <button onClick={cancelEditing} className={styles.btn_danger}>
                    {'<-'}
                  </button>
                </>
              ) : (
                <>
                  <p className={styles.italic}>{user.id}:</p>
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                  <p>{user.group}</p>
                  <button onClick={() => startEditing(user)} className={styles.btn_main}>
                    /
                  </button>
                  <button onClick={() => deleteItem(user.id)} className={styles.btn_danger}>
                    x
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
