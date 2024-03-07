import { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { Button } from 'primereact/button';
import { Draggable } from 'react-beautiful-dnd';

import { projectsKanbanColorSchema } from '@config';
import { useStores } from '@control';
import { ChipList, CustomDivider, EllipsisText } from '@view/common';

import styles from './styles.module.scss';

const colorSchema = projectsKanbanColorSchema;

type TProjectsKanbanItem = {
  project: TProject;
  index: number;
};

const ProjectsKanbanItem: FC<TProjectsKanbanItem> = ({ project, index }) => {
  const { projectsKanbanModal, projectsKanban } = useStores();

  const handleOpenProject = () => {
    window.open(`/tasks-kanban?projectId=${project.id}`, '_blank');
  };

  return (
    <Draggable key={project.id} draggableId={project.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={styles.itemWrapper}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={styles.header}
            style={colorSchema[project.status].header}
          >
            <EllipsisText maxLines={1}>{project.title}</EllipsisText>
          </div>
          <div
            className={styles.content}
            style={colorSchema[project.status].content}
          >
            <CustomDivider title="Срок сдачи" />
            <div>{project.deadline}</div>
            <CustomDivider title="Описание" />
            <EllipsisText maxLines={3} hardBreak>
              {project.description}
            </EllipsisText>
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
            <CustomDivider />
            <div className="flex align-items-center justify-content-end gap-2">
              <Button
                outlined
                label="Редактировать"
                onClick={() =>
                  projectsKanbanModal.openEdit(
                    project.id,
                    projectsKanban.getUserProjects
                  )
                }
              />
              <Button outlined label="Открыть" onClick={handleOpenProject} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default observer(ProjectsKanbanItem);
