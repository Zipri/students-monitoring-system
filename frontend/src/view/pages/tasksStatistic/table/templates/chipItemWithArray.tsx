import { FC, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { v4 } from 'uuid';
import { ChipItem } from 'view/common/chipList/chipItem';

import { TUid } from '@api/types';
import { useStores } from '@control';
import { CustomDivider, EllipsisText } from '@view/common';
import styles from './styles.module.scss';

type Type = {
  adaptedTasks: TTask[];
  emptyLabel: string;
  countLabel: string;
};

const TasksStatisticTableChipItemWithArray: FC<Type> = ({
  adaptedTasks,
  emptyLabel,
  countLabel,
}) => {
  const overlayRef = useRef<OverlayPanel>(null);
  const { tasksStatistic, taskModal } = useStores();

  const handleOpenTaskModal = (taskId: TUid, projectId: TUid) => {
    taskModal.openEdit(tasksStatistic.searchTasks, taskId, projectId);
  };

  const handleOpenKanban = (id: TUid) => {
    window.open(`/tasks-kanban?projectId=${id}`, '_blank');
  };

  if (!adaptedTasks.length) return <>{emptyLabel}</>;

  return (
    <div>
      <OverlayPanel ref={overlayRef} pt={{ root: { className: styles.op } }}>
        {adaptedTasks.map((task, index) => {
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
              {adaptedTasks.length - 1 !== index && <CustomDivider />}
            </div>
          );
        })}
      </OverlayPanel>
      <ChipItem
        id={v4()}
        template={`${countLabel}: ${adaptedTasks.length}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );
};

export default observer(TasksStatisticTableChipItemWithArray);
