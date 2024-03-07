import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { Droppable } from 'react-beautiful-dnd';
import styles from './styles.module.scss';

import { ProjectsKanbanItem } from './kanbanItem';
import { Button } from 'primereact/button';
import { useStores } from '@control';

type TProjectsKanbanColumn = {
  columnId: string;
  title: string;
  projects: TProject[];
};

const ProjectsKanbanColumn: FC<TProjectsKanbanColumn> = ({
  columnId,
  title,
  projects,
}) => {
  const { projectsKanbanModal } = useStores();

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          className={styles.columnWrapper}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div className={styles.header}>{title}</div>

          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              {projects.map((project, index) => (
                <ProjectsKanbanItem
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </div>

            {title === ProjectsStatusesEnum.planning && (
              <Button
                onClick={projectsKanbanModal.openCreate}
                style={{ width: '100%' }}
                severity="success"
                label="Добавить проект"
              />
            )}
          </div>

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default observer(ProjectsKanbanColumn);
