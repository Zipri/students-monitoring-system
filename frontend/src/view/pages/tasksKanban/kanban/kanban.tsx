import { useStores } from '@control';
import { observer } from 'mobx-react-lite';
import { TTask, TaskStatusEnum } from 'model/api/tasks/types';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import styles from './styles.module.scss';
import { TasksKanbanColumn } from './kanbanColumn';

const TasksKanbanPart = () => {
  const { tasksKanban } = useStores();
  const { projectTasks, changeStatus } = tasksKanban;

  const onDragEnd: OnDragEndResponder = (result) => {
    if (result.destination?.droppableId) {
      changeStatus(
        result.draggableId,
        result.destination.droppableId as TaskStatusEnum
      );
    }
  };

  // Группируем проекты по статусам
  const projectsByStatus = projectTasks.reduce(
    (acc: { [key: string]: TTask[] }, project: TTask) => {
      const { status } = project;
      acc[status] = acc[status] ? [...acc[status], project] : [project];
      return acc;
    },
    {}
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.kanbanWrapper}>
        {Object.values(TaskStatusEnum).map((statusValue) => {
          const tasks = projectsByStatus[statusValue] || [];
          return (
            <TasksKanbanColumn
              key={statusValue}
              columnId={statusValue}
              title={statusValue}
              tasks={tasks}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default observer(TasksKanbanPart);
