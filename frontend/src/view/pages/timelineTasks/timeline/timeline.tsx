import { observer } from 'mobx-react-lite';
import Timeline from 'react-calendar-timeline';

import { useStores } from '@control';

const TimelineTasksPart = () => {
  const { timelineTasks, manager } = useStores();
  const { projectTasks, currentProject } = timelineTasks;

  const groups = projectTasks.map((task) => ({
    id: task.id,
    title: task.title,
  }));

  const items = projectTasks.map((task) => ({
    id: task.id,
    group: task.id,
    title: task.title,
    start_time: new Date(task.startDate),
    end_time: new Date(task.deadline),
  }));

  if (!currentProject) return <></>;

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={new Date(currentProject.startDate)}
        defaultTimeEnd={new Date(currentProject.deadline)}
      />
    </div>
  );
};

export default observer(TimelineTasksPart);
