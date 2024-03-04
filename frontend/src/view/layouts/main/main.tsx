import { observer } from 'mobx-react-lite';

import styles from './styles.module.scss';

const MainLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h1>V EduTrack V</h1>
      </div>
    </div>
  );
};

export default observer(MainLayout);
