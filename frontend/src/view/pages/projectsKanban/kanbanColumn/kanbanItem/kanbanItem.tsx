import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { Draggable } from 'react-beautiful-dnd';
import styles from './styles.module.scss';
import { ChipList, CustomDivider } from '@view/common';

type TProjectsKanbanItem = {
  project: TProject;
  index: number;
};

const ProjectsKanbanItem: FC<TProjectsKanbanItem> = ({ project, index }) => {
  return (
    <Draggable key={project.id} draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={styles.itemWrapper}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.header}>{project.title}</div>
          <div className={styles.content}>
            <CustomDivider title="Срок сдачи" />
            <div>{project.deadline}</div>
            <CustomDivider title="Описание" />
            <div>{project.description}</div>
            <CustomDivider title="Ответственный" />
            <div>{project.assignedTeacher.username}</div>
            <div>{project.assignedTeacher.email}</div>
            <CustomDivider title="Студенты" />
            <ChipList
              key={'kanban-projects-item-Студенты'}
              id={project.id}
              maxListChips={3}
              showTooltip
              disableMoreButton
              chipItems={
                project.assignedStudents?.map((i) => ({
                  id: i.id,
                  name: i.username,
                })) || []
              }
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default observer(ProjectsKanbanItem);
