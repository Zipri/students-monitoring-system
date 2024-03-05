import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';

import { useStores } from '@control';
import { NavigationMenu, TopBar } from '@view/pieces';

import styles from './styles.module.scss';

const MainLayout = () => {
  const { user } = useStores();
  const { logout } = user;

  return (
    <div className={styles.wrapper}>
      <TopBar />
      <NavigationMenu />
      <div className={styles.content}>
        <div className="flex flex-column gap-2">
          <h1>V EduTrack V</h1>
        </div>
      </div>
    </div>
  );
};

export default observer(MainLayout);
