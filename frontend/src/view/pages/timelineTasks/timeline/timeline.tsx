import { observer } from 'mobx-react-lite';

import { useStores } from '@control';

const TimelineTasksPart = () => {
  const { timelineTasks, manager } = useStores();
  const { projectTasks, currentProject } = timelineTasks;

  return (
    <div>
      {projectTasks.map((i) => i.status)}
      <br />
      {currentProject?.status}
      {/* <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, 'hour')}
        defaultTimeEnd={moment().add(12, 'hour')}
      /> */}
    </div>
  );
};

export default observer(TimelineTasksPart);
