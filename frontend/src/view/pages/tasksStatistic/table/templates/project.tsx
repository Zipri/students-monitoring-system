import { TUid } from '@api/types';
import { EllipsisText } from '@view/common';
import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { TTask } from 'model/api/tasks/types';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FC, useRef } from 'react';
import { ChipItem } from 'view/common/chipList/chipItem';

type Type = {
  record: TTask;
  projects?: Record<TUid, TProject>;
};

const numberToStudentString = (number: number): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  const titles = ['студент', 'студента', 'студентов'];
  const caseIndex =
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5];
  return `${number} ${titles[caseIndex]}`;
};

const TasksStatisticTableProjectTemplate: FC<Type> = ({ record, projects }) => {
  const overlayRef = useRef<OverlayPanel>(null);
  const studentsCount = projects?.[record.projectId].assignedStudents?.length;

  if (!projects) return <>Проекты отсутствуют</>;

  return (
    <div>
      <OverlayPanel ref={overlayRef}>
        <div className="flex flex-column gap-2">
          <div className="flex align-items-center gap-1">
            <div>Проект:</div>
            <div>{projects[record.projectId].title}</div>
          </div>
          <div className="flex align-items-center gap-1">
            <div>Статус:</div>
            <div>{projects[record.projectId].status}</div>
          </div>
          <div className="flex align-items-center gap-1">
            <div>Начало:</div>
            <div>{projects[record.projectId].startDate}</div>
          </div>
          <div className="flex align-items-center gap-1">
            <div>Конец:</div>
            <div>{projects[record.projectId].deadline}</div>
          </div>
          <div className="flex align-items-center gap-1">
            <div>Ответственный:</div>
            <div>{projects[record.projectId].assignedTeacher.username}</div>
          </div>
          <div>{!!studentsCount && numberToStudentString(studentsCount)}</div>
        </div>
      </OverlayPanel>
      <ChipItem
        id={record.projectId}
        template={
          <EllipsisText hardBreak>
            {projects[record.projectId].title}
          </EllipsisText>
        }
        fullWidth
        style={{ cursor: 'pointer' }}
        onClick={(e) => overlayRef.current?.toggle(e)}
      />
    </div>
  );
};

export default observer(TasksStatisticTableProjectTemplate);
