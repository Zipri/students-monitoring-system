import { observer } from 'mobx-react-lite';
import { OnDragEndResponder } from 'react-beautiful-dnd';

const TasksKanbanPart = () => {
  // const onDragEnd: OnDragEndResponder = (result) => {
  //   if (result.destination?.droppableId) {
  //     changeStatus(
  //       result.draggableId,
  //       result.destination.droppableId as ProjectsStatusesEnum
  //     );
  //   }
  // };

  // // Группируем проекты по статусам
  // const projectsByStatus = userProjects.reduce(
  //   (acc: { [key: string]: TProject[] }, project: TProject) => {
  //     const { status } = project;
  //     acc[status] = acc[status] ? [...acc[status], project] : [project];
  //     return acc;
  //   },
  //   {}
  // );

  return (
    <div>
      {/* <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.kanbanWrapper}>
          {Object.values(ProjectsStatusesEnum).map((statusValue) => {
            const projects = projectsByStatus[statusValue] || [];
            return (
              <ProjectsKanbanColumn
                key={statusValue}
                columnId={statusValue}
                title={statusValue}
                projects={projects}
              />
            );
          })}
        </div>
      </DragDropContext> */}
    </div>
  );
};

export default observer(TasksKanbanPart);
