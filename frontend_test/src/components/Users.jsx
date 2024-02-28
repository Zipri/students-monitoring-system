import React, { useEffect, useState } from 'react';

import axios from 'axios';

import styles from './styles.module.css';

const URL = 'http://127.0.0.1:5000';

function generateRandomWord(length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let word = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    word += alphabet[randomIndex];
  }

  return word;
}

const Users = () => {
  // ## Добавление нового пользователя
  const [addedUserName, setAddedUser] = useState('');
  const [addedUserEmail, setAddedEmail] = useState('');
  const [addedUserRole, setAddedRole] = useState('');
  const [addedUserGroup, setAddedGroup] = useState('');
  // ## Обновление данных пользователя по идентификатору
  const [updatedUser, setUpdatedUser] = useState('');
  const [updatedUserId, setUpdatedUserId] = useState('');
  // ## Получение списка всех пользователей
  const [users, setUsers] = useState([]);
  // ## Возвращает всех студентов заданной группы
  const [group, setGroup] = useState('');
  const [groupies, setGroupies] = useState([]);

  const handleGenerate = () => {
    setAddedUser(generateRandomWord(8));
    setAddedEmail(generateRandomWord(4));
    setAddedRole(generateRandomWord(6));
    setAddedGroup(generateRandomWord(3));
  };

  const handleStudentGenerate = () => {
    setAddedUser(generateRandomWord(8));
    setAddedEmail(generateRandomWord(4));
    setAddedRole('student');
    setAddedGroup(generateRandomWord(3));
  };

  // Функция для загрузки всех элементов
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // Функция для добавления элемента
  const addItem = async () => {
    if (!addedUserName) {
      alert('Пожалуйста, введите значение');
      return;
    }
    try {
      await axios.post(`${URL}/users/add`, {
        username: addedUserName,
        email: addedUserEmail,
        role: addedUserRole,
        group: addedUserGroup,
      });
      setAddedUser('');
      setAddedEmail('');
      setAddedRole('');
      setAddedGroup('');
      fetchItems(); // Перезагрузка элементов после добавления
    } catch (error) {
      console.error('Ошибка при добавлении данных:', error);
    }
  };

  // Функция для удаления элемента
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${URL}/users/delete/${id}`);
      fetchItems(); // Перезагрузка элементов после добавления
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  };

  // Функция для обновления элемента
  const updateItem = async () => {
    try {
      await axios.put(`${URL}/users/update/${updatedUserId}`, { username: updatedUser });
      fetchItems(); // Перезагрузка элементов после добавления
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  // Возвращает всех студентов заданной группы
  const getUsersByGroup = async () => {
    try {
      const response = await axios.get(`${URL}/users/group/${group}`);
      setGroupies(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className={`${styles.flex_column}`}>
      <h1 className={styles.header_large}>Менеджер Пользователей</h1>

      <div className={styles.header_medium}>Add</div>
      <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
        <input
          type="text"
          value={addedUserName}
          onChange={(e) => setAddedUser(e.target.value)}
          placeholder="Введите имя"
          className={styles.input}
        />
        <button onClick={handleGenerate} className={styles.btn_main}>
          Generate
        </button>
        <button onClick={handleStudentGenerate} className={styles.btn_main}>
          Студент
        </button>
      </div>
      <div className={`${styles.flex_column}`} style={{ width: '26rem' }}>
        <input
          type="text"
          value={addedUserEmail}
          onChange={(e) => setAddedEmail(e.target.value)}
          placeholder="Введите Email"
          className={styles.input}
        />
        <input
          type="text"
          value={addedUserRole}
          onChange={(e) => setAddedRole(e.target.value)}
          placeholder="Введите Role"
          className={styles.input}
        />
        <input
          type="text"
          value={addedUserGroup}
          onChange={(e) => setAddedGroup(e.target.value)}
          placeholder="Введите Group"
          className={styles.input}
        />
      </div>
      <button onClick={addItem} className={styles.btn_second} style={{ width: '6rem' }}>
        Добавить
      </button>

      <div className={styles.header_medium}>Update</div>
      <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
        <input
          type="text"
          value={updatedUserId}
          onChange={(e) => setUpdatedUserId(e.target.value)}
          placeholder="Введите id элемента"
          className={styles.input}
        />
        <input
          type="text"
          value={updatedUser}
          onChange={(e) => setUpdatedUser(e.target.value)}
          placeholder="Новое название элемента"
          className={styles.input}
        />
        <button onClick={updateItem} className={styles.btn_second}>
          Изменить
        </button>
      </div>

      <div className={styles.header_medium}>Get / Delete</div>
      <div className={`${styles.flex} ${styles.flex_between}`}>
        <div>
          <button onClick={fetchItems} className={styles.btn_main}>
            Загрузить элементы
          </button>
          {!!users.length && (
            <ul className={`${styles.flex_column} ${styles.list}`}>
              {users.map((item, index) => (
                <li key={index} className={`${styles.flex} ${styles.flex_gap_medium}`}>
                  <em className={styles.italic}>{item.id}:</em> {item.group}/{item.username}
                  <button onClick={() => deleteItem(item.id)} className={styles.btn_danger}>
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className={`${styles.flex} ${styles.flex_gap_medium}`}>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Введите группу"
              className={styles.input}
            />
            <button onClick={getUsersByGroup} className={styles.btn_main}>
              Загрузить элементы
            </button>
          </div>
          <ul className={`${styles.flex_column} ${styles.list}`}>
            {groupies.map((item, index) => (
              <li key={index} className={`${styles.flex} ${styles.flex_gap_medium}`}>
                <em className={styles.italic}>{item.id}:</em> {item.username}
                <button onClick={() => deleteItem(item.id)} className={styles.btn_danger}>
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;
