import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { DragDropContext } from 'react-beautiful-dnd';

import { useStores } from '@control';

import { ProjectsKanbanColumn } from './kanbanColumn';
import styles from './styles.module.scss';

const ProjectsKanban = () => {
  const { projectsKanban } = useStores();
  const { userProjects, userInfo, getUserProjects } = projectsKanban;

  const onDragEnd = (result: any) => {
    console.log(result);
  };

  // Группируем проекты по статусам
  const projectsByStatus = userProjects.reduce(
    (acc: { [key: string]: TProject[] }, project: TProject) => {
      const { status } = project;
      acc[status] = acc[status] ? [...acc[status], project] : [project];
      return acc;
    },
    {}
  );

  useEffect(() => {
    getUserProjects();
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.kanbanWrapper}>
        {Object.entries(ProjectsStatusesEnum).map(
          ([statusKey, statusValue]) => {
            const projects = projectsByStatus[statusValue] || [];
            return (
              <ProjectsKanbanColumn
                key={statusKey}
                columnId={statusKey}
                title={statusValue}
                projects={projects}
              />
            );
          }
        )}
      </div>
    </DragDropContext>
  );
};

export default observer(ProjectsKanban);
