import { FC, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ChipItem } from 'view/common/chipList/chipItem';

import { TUid } from '@api/types';
import { CustomDivider, EllipsisText } from '@view/common';
import { useStores } from '@control';

type Type = {
  tasks: TTask[];
  projects?: Record<TUid, TProject>;
};

const countSkippedTasks = (
  tasks: TTask[],
  projects?: Record<TUid, TProject>
) => {
  const currentDate = new Date();
  const skippedTasks: TTask[] = [];

  tasks.forEach((task) => {
    const startDate = new Date(task.startDate);
    const deadline = new Date(task.deadline);

    if (
      task.status === TaskStatusEnum.new &&
      currentDate > startDate &&
      currentDate < deadline &&
      projects?.[task.projectId].status !== ProjectsStatusesEnum.postponed
    ) {
      skippedTasks.push(task);
    }
  });

  return skippedTasks;
};

const TasksStatisticTableSkippedTemplate: FC<Type> = ({ tasks, projects }) => {
  const overlayRef = useRef<OverlayPanel>(null);
  const { tasksStatistic, taskModal } = useStores();

  const handleOpenTaskModal = (taskId: TUid, projectId: TUid) => {
    taskModal.openEdit(tasksStatistic.searchTasks, taskId, projectId);
  };

  const handleOpenKanban = (id: TUid) => {
    window.open(`/tasks-kanban?projectId=${id}`, '_blank');
  };

  const skippedTasks = countSkippedTasks(tasks, projects);

  if (!skippedTasks.length) return <>Пропущенных задач нет</>;

  return (
    <div>
      <OverlayPanel ref={overlayRef}>
        {skippedTasks.map((task, index) => {
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
              {skippedTasks.length - 1 !== index && <CustomDivider />}
            </div>
          );
        })}
      </OverlayPanel>
      <ChipItem
        id={tasks[0].id}
        template={`Пропущенных задач: ${skippedTasks.length}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );
};

export default observer(TasksStatisticTableSkippedTemplate);
