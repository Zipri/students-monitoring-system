import React from 'react';
import styles from './styles.module.css';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div className={`${styles.header} ${styles.flex} ${styles.flex_center}`}>
      <NavLink
        to={'/'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        Описание
      </NavLink>
      <NavLink
        to={'/users'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        Пользователи
      </NavLink>
      <NavLink
        to={'/projects'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        Проекты
      </NavLink>
      <NavLink
        to={'/tasks'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        Задачи
      </NavLink>
      <NavLink
        to={'/comments'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        Комментарии
      </NavLink>
    </div>
  );
};

export default Header;
