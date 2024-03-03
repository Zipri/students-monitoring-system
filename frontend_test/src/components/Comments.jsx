import React, { useEffect, useState } from 'react';

import axios from 'axios';

import styles from './styles.module.css';

const baseURL = 'http://127.0.0.1:5000';

function generateRandomWord(length) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz !/>,.=_+-';
  let word = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    word += alphabet[randomIndex];
  }

  return word;
}

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ taskId: '', authorId: '', text: '' });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentData, setEditingCommentData] = useState({ text: '' });

  // ## Список всех проектов
  const [tasks, setTasks] = useState([]);
  // ## Получение списка всех пользователей
  const [users, setUsers] = useState([]);
  // ## Получение комментариев по идентификатору задачи
  const [taskId, setTaskId] = useState('');

  // Получение комментариев по идентификатору задачи
  const fetchCommentsByTask = async () => {
    try {
      const response = taskId.length
        ? await axios.get(`${baseURL}/comments/task/${taskId}`)
        : await axios.get(`${baseURL}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка при получении комментариев:', error);
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

  // Функция для загрузки всех элементов
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseURL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  const handleGenerate = () => {
    setNewComment({ ...newComment, text: generateRandomWord(60) });
  };

  // Получение всех комментариев
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${baseURL}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка при получении комментариев:', error);
    }
  };

  // Добавление нового комментария
  const addComment = async () => {
    try {
      await axios.post(`${baseURL}/comments/add`, newComment);
      fetchComments(); // Перезагрузка комментариев
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };

  // Обновление комментария
  const updateComment = async () => {
    try {
      if (!editingCommentId || !editingCommentData.text.length) return;
      await axios.put(`${baseURL}/comments/update/${editingCommentId}`, editingCommentData);
      fetchComments(); // Перезагрузка комментариев
    } catch (error) {
      console.error('Ошибка при обновлении комментария:', error);
    }
  };

  // Удаление комментария
  const deleteComment = async (id) => {
    try {
      await axios.delete(`${baseURL}/comments/delete/${id}`);
      fetchComments(); // Перезагрузка комментариев
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchTasks();
    fetchUsers();
  }, []);

  return (
    <div className={`${styles.flex_column} ${styles.container}`}>
      {/* <h1 className={styles.header_large}>Управление комментариями</h1> */}

      <div className={`${styles.flex_start} ${styles.flex_gap_medium}`}>
        <div
          className={`${styles.flex_column} ${styles.flex_gap_small}`}
          style={{ width: '20rem' }}
        >
          <div className={styles.header_medium}>Добавить комментарий</div>
          <input
            className={styles.input}
            type="text"
            placeholder="ID автора"
            value={newComment.authorId}
            onChange={(e) => setNewComment({ ...newComment, authorId: e.target.value })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="ID задачи"
            value={newComment.taskId}
            onChange={(e) => setNewComment({ ...newComment, taskId: e.target.value })}
          />
          <textarea
            className={styles.input}
            style={{ resize: 'vertical', width: '17.9rem' }}
            placeholder="Текст комментария"
            value={newComment.text}
            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
          />
          <button className={styles.btn_main} onClick={handleGenerate}>
            Сгенерировать данные
          </button>
          <button onClick={addComment} className={styles.btn_second}>
            Добавить
          </button>
        </div>

        <div
          className={`${styles.flex_column} ${styles.flex_gap_small}`}
          style={{ width: '39rem', height: '15rem' }}
        >
          <div className={styles.header_medium}>Список пользователей</div>
          <div className={`${styles.flex_column} ${styles.list}`} style={{ width: '39rem' }}>
            {users.map((user) => (
              <div key={user.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
                <p className={styles.italic}>{user.id}:</p>
                <p>{user.username}</p>
                <p>{user.role}</p>
                <p>{user.group}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`${styles.flex_column} ${styles.flex_gap_small}`}
        style={{ width: '85vw', height: '15rem' }}
      >
        <div className={styles.header_medium}>Список задач</div>
        <div className={`${styles.flex_column} ${styles.list}`} style={{ width: '85vw' }}>
          {tasks.map((task) => (
            <div key={task.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
              <p className={styles.italic}>{task.id}:</p>
              <p>{task.title}</p>
              <p>{task.description}</p>
              <p>{task.status}</p>
              <p>{task.priority}</p>
              <p>{task.deadline}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.flex} ${styles.flex_gap_small}`}>
        <div className={styles.header_medium}>Комментарии</div>
        <input
          className={styles.input}
          type="text"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="Введите ID задачи"
        />
        <button onClick={fetchCommentsByTask} className={styles.btn_main}>
          Получить комментарии
        </button>
      </div>
      <div
        className={`${styles.flex_column} ${styles.list}`}
        style={{ width: '86vw', height: '17rem' }}
      >
        {comments.map((comment) => (
          <div key={comment.id} className={`${styles.flex} ${styles.flex_gap_medium}`}>
            {editingCommentId === comment.id ? (
              <>
                <p className={styles.italic}>{comment.id}:</p>
                <input
                  className={styles.input}
                  style={{ width: '25rem' }}
                  type="text"
                  placeholder="Текст"
                  value={editingCommentData.text}
                  onChange={(e) =>
                    setEditingCommentData({ ...editingCommentData, text: e.target.value })
                  }
                />
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
                <button
                  onClick={() => {
                    setEditingCommentId('');
                    updateComment();
                  }}
                  className={styles.btn_second}
                >
                  V
                </button>
              </>
            ) : (
              <>
                <p className={styles.italic}>{comment.id}:</p>
                <p>{comment.text}</p>
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
                <button
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingCommentData({ text: comment.text });
                  }}
                  className={styles.btn_main}
                >
                  /
                </button>
              </>
            )}

            <button onClick={() => deleteComment(comment.id)} className={styles.btn_danger}>
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
