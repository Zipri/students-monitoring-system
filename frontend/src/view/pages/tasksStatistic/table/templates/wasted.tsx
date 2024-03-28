import { TUid } from '@api/types';
import { ChipList, CustomDivider, EllipsisText } from '@view/common';
import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { TTask, TaskStatusEnum } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FC, useRef } from 'react';
import { ChipItem } from 'view/common/chipList/chipItem';
import styles from './styles.module.scss';
import { useStores } from '@control';

type Type = {
  tasks: TTask[];
};

const countOverdueTasks = (tasks: TTask[]) => {
  const currentDate = new Date();
  const overdueTasks: TTask[] = [];

  tasks.forEach((task) => {
    const deadlineDate = new Date(task.deadline);
    if (task.status !== TaskStatusEnum.done && currentDate > deadlineDate) {
      overdueTasks.push(task);
    }
  });

  return overdueTasks;
};

const TasksStatisticTableWastedTemplate: FC<Type> = ({ tasks }) => {
  const overlayRef = useRef<OverlayPanel>(null);
  const { tasksStatistic, taskModal } = useStores();

  const handleOpenTaskModal = (taskId: TUid, projectId: TUid) => {
    taskModal.openEdit(tasksStatistic.searchTasks, taskId, projectId);
  };

  const handleOpenKanban = (id: TUid) => {
    window.open(`/tasks-kanban?projectId=${id}`, '_blank');
  };

  const overdueTasks = countOverdueTasks(tasks);

  if (!overdueTasks.length) return <>Просроченных задач нет</>;

  return (
    <div>
      <OverlayPanel ref={overlayRef}>
        {overdueTasks.map((task, index) => {
          return (
            <div key={index} className="w-20rem flex flex-column gap-2">
              <div className="flex align-items-center gap-1">
                <div>Задача:</div>
                <EllipsisText hardBreak>{task.title}</EllipsisText>
              </div>
              <div className="flex align-items-center gap-1">
                <div>Описание:</div>
                <EllipsisText hardBreak>{task.description}</EllipsisText>
              </div>
              <div className="flex align-items-center gap-1 justify-content-end">
                <Button
                  text
                  icon="pi pi-external-link"
                  onClick={() => handleOpenKanban(task.projectId)}
                >
                  <div className="ml-2">Проект</div>
                </Button>
                <Button
                  text
                  icon="pi pi-external-link"
                  onClick={() => handleOpenTaskModal(task.id, task.projectId)}
                >
                  <div className="ml-2">Задача</div>
                </Button>
              </div>
              {overdueTasks.length - 1 !== index && <CustomDivider />}
            </div>
          );
        })}
      </OverlayPanel>
      <ChipItem
        id={tasks[0].id}
        template={`Просроченных задач: ${overdueTasks.length}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );
};

export default observer(TasksStatisticTableWastedTemplate);
