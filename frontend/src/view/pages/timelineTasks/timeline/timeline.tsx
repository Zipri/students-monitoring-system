import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

import { TimelineTasksPartStaticInfoPart } from './staticInfoPart';
import styles from './styles.module.scss';
import { TableTimeline } from './tableTimeline';

const TimelineTasksPart = () => {
  return (
    <div className={styles.wrapper}>
      <TimelineTasksPartStaticInfoPart />
      <TableTimeline />
    </div>
  );
};

export default observer(TimelineTasksPart);
