import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { Droppable } from 'react-beautiful-dnd';
import styles from './styles.module.scss';

import { ProjectsKanbanItem } from './kanbanItem';
import { Button } from 'primereact/button';

type TProjectsKanbanColumn = {
  columnId: string;
  title: string;
  projects: TProject[];
};

const ProjectsKanbanColumn: FC<TProjectsKanbanColumn> = ({
  columnId,
  title,
  projects,
}) => (
  <Droppable droppableId={columnId}>
    {(provided, snapshot) => (
      <div
        className={styles.columnWrapper}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div className={styles.header}>
          {title}
          {/* {title === ProjectsStatusesEnum.planning && (
            <Button text icon="pi pi-plus" tooltip="Добавить проект" />
          )} */}
          {title === ProjectsStatusesEnum.planning && (
            <Button outlined label="Добавить" />
          )}
        </div>

        <div className={styles.content}>
          {/* {title === ProjectsStatusesEnum.planning && (
            <Button style={{ width: '100%' }} outlined label="Добавить" />
          )} */}
          {projects.map((project, index) => (
            <ProjectsKanbanItem
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default observer(ProjectsKanbanColumn);
