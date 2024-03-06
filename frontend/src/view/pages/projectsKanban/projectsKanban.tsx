import { useStores } from '@control';
import { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const ProjectsKanban = () => {
  const { projectsKanban } = useStores();
  const { userProjects, userInfo, getUserProjects } = projectsKanban;

  const onDragEnd = (result: any) => {
    console.log(result);
  };

  useEffect(() => {
    getUserProjects();
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {userProjects.map((project, index) => (
                <Draggable
                  key={project.id}
                  draggableId={project.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* Здесь ваш контент для перетаскивания */}
                      {project.title}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ProjectsKanban;
