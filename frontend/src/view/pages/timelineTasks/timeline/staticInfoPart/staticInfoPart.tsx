import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';

import { TUid } from '@api/types';
import { tasksKanbanColorSchema } from '@config';
import { EllipsisText } from '@view/common';

import styles from './styles.module.scss';
import { useStores } from '@control';
import { toJS } from 'mobx';

const colorSchema = tasksKanbanColorSchema;

const TimelineTasksPartStaticInfoPart = () => {
  const { projectFiltersWithUrl, taskModal, timelineTasks } = useStores();
  const { userProjects, projectId } = projectFiltersWithUrl;
  const { projectTasks, getProjectTasks } = timelineTasks;

  const isUserProject = userProjects.some(
    (project) => project.id === projectId
  );

  const timelineTaskItems = (toJS(projectTasks) || []).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const confirmDeleteItem = (id: TUid) => {
    confirmDialog({
      message:
        'Вы точно хотите удалить запись? После удаления запись восстановить нельзя',
      header: 'Подтверждение удаления записи',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await taskModal.deleteTask(id);
        getProjectTasks(projectId);
      },
    });
  };

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
        {timelineTaskItems.map((task) => (
          <tr key={task.id}>
            <td
              className={styles.td}
              style={colorSchema[task.status as TaskStatusEnum].content}
            >
              <div className={styles.staticContent}>
                <EllipsisText hardBreak>{task.title}</EllipsisText>
                <Button
                  text
                  severity="danger"
                  tooltip="Удалить"
                  tooltipOptions={{ position: 'top' }}
                  icon="pi pi-trash"
                  onClick={() => confirmDeleteItem(task.id)}
                  disabled={!isUserProject}
                />
                <Button
                  text
                  tooltip="Открыть"
                  tooltipOptions={{ position: 'top' }}
                  icon="pi pi-external-link"
                  onClick={() =>
                    taskModal.openEdit(
                      () => getProjectTasks(projectId),
                      task.id,
                      projectId
                    )
                  }
                  disabled={!isUserProject}
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
