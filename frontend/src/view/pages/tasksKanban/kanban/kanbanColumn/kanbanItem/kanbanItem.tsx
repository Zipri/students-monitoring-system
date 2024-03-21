import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Draggable } from 'react-beautiful-dnd';

import { TUid } from '@api/types';
import { tasksPriorityColorSchema } from '@config';
import { useStores } from '@control';
import { CustomDivider, EllipsisText } from '@view/common';

import styles from './styles.module.scss';

const colorSchema = tasksPriorityColorSchema;

type TTasksKanbanItem = {
  task: TTask;
  index: number;
};

const TasksKanbanItem: FC<TTasksKanbanItem> = ({ task, index }) => {
  const { projectsKanbanModal, projectsKanban } = useStores();

  const confirmDeleteItem = (id: TUid) => {
    confirmDialog({
      message:
        'Вы точно хотите удалить запись? После удаления запись восстановить нельзя',
      header: 'Подтверждение удаления записи',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => console.log(id),
    });
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={styles.itemWrapper}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={styles.header}
            style={colorSchema[task.priority].header}
          >
            <EllipsisText maxLines={1}>{task.title}</EllipsisText>
          </div>
          <div
            className={styles.content}
            style={colorSchema[task.priority].content}
          >
            <CustomDivider title="Приоритет" />
            <div>{task.priority}</div>
            {task.deadline && (
              <>
                <CustomDivider title="Срок задачи" />
                <div>{task.deadline}</div>
              </>
            )}
            <CustomDivider title="Описание" />
            <EllipsisText maxLines={3}>{task.description}</EllipsisText>
            <CustomDivider />
            <div className="flex align-items-center justify-content-end gap-2">
              <Button
                outlined
                severity="danger"
                tooltip="Удалить"
                tooltipOptions={{ position: 'top' }}
                label="Удалить"
                onClick={() => confirmDeleteItem(task.id)}
              />
              <Button
                outlined
                tooltip="Открыть"
                tooltipOptions={{ position: 'top' }}
                label="Открыть"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default observer(TasksKanbanItem);
