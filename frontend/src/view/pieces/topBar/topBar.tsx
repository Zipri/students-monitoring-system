import { observer } from 'mobx-react-lite';
import { UsersRolesEnum } from 'model/api/users/types';
import { Button } from 'primereact/button';

import { useStores } from '@control';

import styles from './styles.module.scss';

const TopBar = () => {
  const { user } = useStores();
  const { info, logout } = user;

  const adminGroup = info.email === 'admin@admin.com' ? 'ИУ6-41М' : undefined;

  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>EduTrack</div>

      <div className="flex align-items-center gap-5">
        <div className="flex flex-column gap-1">
          <div>{info.username}</div>
          <div>{info.email}</div>
        </div>

        <div className="flex flex-column gap-1">
          <div>{info.role}</div>
          {(info.role === UsersRolesEnum.student || adminGroup) && (
            <div>{info.group || adminGroup}</div>
          )}
        </div>

        <Button severity="danger" onClick={logout} label="Выйти" />
      </div>
    </div>
  );
};

export default observer(TopBar);
