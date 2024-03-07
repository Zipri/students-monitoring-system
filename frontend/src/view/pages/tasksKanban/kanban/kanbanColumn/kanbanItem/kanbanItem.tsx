import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { Draggable } from 'react-beautiful-dnd';

import { projectsKanbanColorSchema, tasksKanbanColorSchema } from '@config';
import { ChipList, CustomDivider, EllipsisText } from '@view/common';

import styles from './styles.module.scss';
import { Button } from 'primereact/button';
import { useStores } from '@control';
import { TTask } from 'model/api/tasks/types';

const colorSchema = tasksKanbanColorSchema;

type TTasksKanbanItem = {
  task: TTask;
  index: number;
};

const TasksKanbanItem: FC<TTasksKanbanItem> = ({ task, index }) => {
  const { projectsKanbanModal, projectsKanban } = useStores();

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
            style={colorSchema[task.status].header}
          >
            <EllipsisText maxLines={1}>{task.title}</EllipsisText>
          </div>
          <div
            className={styles.content}
            style={colorSchema[task.status].content}
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
                label="Редактировать"
                onClick={() =>
                  projectsKanbanModal.openEdit(
                    task.id,
                    projectsKanban.getUserProjects
                  )
                }
              />
              <Button outlined label="Открыть" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default observer(TasksKanbanItem);
