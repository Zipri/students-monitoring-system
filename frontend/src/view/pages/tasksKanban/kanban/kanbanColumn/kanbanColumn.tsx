import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Droppable } from 'react-beautiful-dnd';

import { tasksKanbanColorSchema } from '@config';
import { useStores } from '@control';

import { TasksKanbanItem } from './kanbanItem';
import styles from './styles.module.scss';

const colorSchema = tasksKanbanColorSchema;

type TTasksKanbanColumn = {
  columnId: string;
  title: string;
  tasks: TTask[];
};

const TasksKanbanColumn: FC<TTasksKanbanColumn> = ({
  columnId,
  title,
  tasks,
}) => {
  const { projectsKanbanModal, projectsKanban } = useStores();

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          className={styles.columnWrapper}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div
            className={styles.header}
            style={colorSchema[title as TaskStatusEnum].header}
          >
            {title}
          </div>

          <div className={styles.contentWrapper}>
            <div
              className={classNames(styles.content, {
                [styles.contentOfPlanning]: title === TaskStatusEnum.new,
              })}
              style={colorSchema[title as TaskStatusEnum].content}
            >
              {tasks.map((task, index) => (
                <TasksKanbanItem key={task.id} task={task} index={index} />
              ))}
            </div>

            {title === TaskStatusEnum.new && (
              <Button
                // onClick={() =>
                //   projectsKanbanModal.openCreate(projectsKanban.getUserProjects)
                // }
                style={{ width: '100%' }}
                severity="success"
                label="Добавить задачу"
              />
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default observer(TasksKanbanColumn);
