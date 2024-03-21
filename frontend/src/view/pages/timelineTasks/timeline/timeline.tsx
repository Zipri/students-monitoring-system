import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

import { TimelineTasksPartStaticInfoPart } from './staticInfoPart';
import styles from './styles.module.scss';
import { TableTimeline } from './tableTimeline';

const TimelineTasksPart = () => {
  const { timelineTasks } = useStores();
  const { projectTasks, currentProject } = timelineTasks;

  if (!currentProject) return <></>;
  return (
    <div className={styles.wrapper}>
      <TimelineTasksPartStaticInfoPart projectTasks={projectTasks} />
      <TableTimeline
        currentProject={currentProject}
        projectTasks={projectTasks}
      />
    </div>
  );
};

export default observer(TimelineTasksPart);
