import React, { FC } from 'react';

import { observer } from 'mobx-react-lite';
import { TGroupStudents } from 'model/api/groups/types';
import { TProjectExtended } from 'model/api/projects/types';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { ProgressBar } from 'primereact/progressbar';
import { v4 } from 'uuid';

import { projectsKanbanColorSchema } from '@config';
import { ChipList, EllipsisText } from '@view/common';

import styles from '../styles.module.scss';
import { FormLabel } from '@view/form';
import { TUid } from '@api/types';
import { Button } from 'primereact/button';

const colorSchema = projectsKanbanColorSchema;

const getDoneTasksPercent = (tasks: TTask[]) => {
  // return Math.floor(Math.random() * 100);
  if (!tasks.length) {
    return 0;
  }

  const doneTasks = tasks.filter((task) => task.status === TaskStatusEnum.done);
  if (!doneTasks.length) {
    return 0;
  }
  return Math.round((doneTasks.length / tasks.length) * 100);
};

type TProjectsStatisticItem = {
  statisticProject: TProjectExtended;
  student: TGroupStudents;
};

const ProjectsStatisticItem: FC<TProjectsStatisticItem> = ({
  statisticProject,
  student,
}) => {
  const percent = getDoneTasksPercent(statisticProject.tasks);
  const studentsIds = statisticProject.assignedStudents?.map((i) => i.id);

  const handleOpenProject = (id: TUid) => {
    window.open(`/tasks-kanban?projectId=${id}`, '_blank');
  };

  const handleOpenTimeline = (id: TUid) => {
    window.open(`/tasks-timeline?projectId=${id}`, '_blank');
  };

  //   useHorizontalScroll(`project-statistic-part-item-${statisticProject.id}`);

  if (!studentsIds?.includes(student.id)) return;

  return (
    <div key={v4()} className={styles.acItem}>
      <div
        id={`project-statistic-part-item-${statisticProject.id}`}
        className={styles.label}
      >
        <div
          className={styles.item}
          // onClick={(e) => overlayRef.current?.toggle(e)}
        >
          <FormLabel
            htmlFor="statisticProject.title"
            caption=""
            template={
              <EllipsisText hardBreak>{statisticProject.title}</EllipsisText>
            }
            bold
          />
        </div>

        <div
          className={styles.item}
          style={{
            ...colorSchema[statisticProject.status].content,
            width: '10rem',
          }}
        >
          {statisticProject.status}
        </div>

        <div className={styles.item}>
          <EllipsisText hardBreak>
            {`${statisticProject.startDate} -- ${statisticProject.deadline}`}
          </EllipsisText>
        </div>

        <div className={styles.item}>
          <EllipsisText hardBreak>
            {statisticProject.assignedTeacher.username}
          </EllipsisText>
        </div>

        <ChipList
          id={v4()}
          chipItems={
            statisticProject.assignedStudents?.map((i) => ({
              id: i.id,
              name: i.username,
            })) || []
          }
          maxListChips={1}
          className={styles.chips}
          chipClassName={styles.chip}
        />

        <ChipList
          id={v4()}
          chipItems={
            statisticProject.tasks?.map((i) => ({
              id: i.id,
              name: i.title,
            })) || []
          }
          maxListChips={1}
          className={styles.chips}
          chipClassName={styles.chip}
        />

        <div className="flex w-min align-items-center gap-2">
          <Button
            outlined
            tooltip="Открыть таймлайн"
            tooltipOptions={{ position: 'top' }}
            icon="pi pi-sliders-h"
            onClick={() => handleOpenTimeline(statisticProject.id)}
            style={{ height: '29px', width: '29px' }}
          />
          <Button
            outlined
            tooltip="Открыть"
            tooltipOptions={{ position: 'top' }}
            icon="pi pi-external-link"
            onClick={() => handleOpenProject(statisticProject.id)}
            style={{ height: '29px', width: '29px' }}
          />
        </div>
      </div>

      {!!percent && (
        <ProgressBar
          pt={{
            root: { className: styles.progress },
            value: { className: styles.progressContainer },
          }}
          value={getDoneTasksPercent(statisticProject.tasks)}
        />
      )}

      {!percent && (
        <div className={styles.progressTemplate} style={{ fontWeight: 'bold' }}>
          В проекте нет завершенных задач
        </div>
      )}
    </div>
  );
};

export default observer(ProjectsStatisticItem);
