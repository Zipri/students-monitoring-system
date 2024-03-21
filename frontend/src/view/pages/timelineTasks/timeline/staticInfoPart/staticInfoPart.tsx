import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';

import { tasksKanbanColorSchema } from '@config';
import { EllipsisText } from '@view/common';

import styles from './styles.module.scss';

const colorSchema = tasksKanbanColorSchema;

type Type = {
  projectTasks: TTask[];
};

const TimelineTasksPartStaticInfoPart: FC<Type> = ({ projectTasks }) => {
  return (
    <table className={styles.infoTable}>
      <thead>
        <tr>
          <th className={styles.th}>Месяц</th>
        </tr>
        <tr>
          <th className={styles.th}>День</th>
        </tr>
      </thead>
      <tbody>
        {projectTasks.map((task) => (
          <tr key={task.id}>
            <td
              className={styles.td}
              style={colorSchema[task.status as TaskStatusEnum].content}
            >
              <div className={styles.staticContent}>
                <EllipsisText>{task.title}</EllipsisText>
                <Button
                  text
                  tooltip="Открыть"
                  tooltipOptions={{ position: 'top' }}
                  icon="pi pi-external-link"
                  onClick={() => {}}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default observer(TimelineTasksPartStaticInfoPart);
