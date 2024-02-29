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
        Home
      </NavLink>
      <NavLink
        to={'/users'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        users
      </NavLink>
      <NavLink
        to={'/projects'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        projects
      </NavLink>
      <NavLink
        to={'/tasks'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        tasks
      </NavLink>
      <NavLink
        to={'/comments'}
        className={({ isActive }) =>
          isActive
            ? `${styles.btn_home_active} ${styles.btn_home}`
            : `${styles.btn_main} ${styles.btn_home}`
        }
      >
        comments
      </NavLink>
    </div>
  );
};

export default Header;
