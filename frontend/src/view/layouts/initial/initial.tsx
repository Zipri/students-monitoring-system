import { observer } from 'mobx-react-lite';
import { ProgressSpinner } from 'primereact/progressspinner';

import styles from './styles.module.scss';

const InitialLayout = () => {
  return (
    <div className={styles.wrapper}>
      <div>
        <h1>EduTrack</h1>
        <ProgressSpinner />
      </div>
    </div>
  );
};

export default observer(InitialLayout);
