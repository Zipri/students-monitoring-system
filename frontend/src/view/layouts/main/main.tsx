import { observer } from 'mobx-react-lite';

import styles from './styles.module.scss';
import { useStores } from '@control';
import { Button } from 'primereact/button';

const MainLayout = () => {
  const { user } = useStores();
  const { logout } = user;

  return (
    <div className={styles.wrapper}>
      <div className="flex flex-column gap-2">
        <h1>V EduTrack V</h1>
        <Button severity="danger" onClick={logout} label="Выйти" />
      </div>
    </div>
  );
};

export default observer(MainLayout);
