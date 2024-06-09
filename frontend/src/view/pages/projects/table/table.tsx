import { useEffect, useMemo } from 'react';

import { toJS } from 'mobx';
import { TProject } from 'model/api/projects/types';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useStores } from '@control';
import { ChipList, EllipsisText } from '@view/common';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { TUid } from '@api/types';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { TasksStatisticTableHeaderTemplate } from 'view/pages/tasksStatistic/table/templates';
import { TTaskSortByEnum } from 'model/services/tasks/types';

const ProjectsTable = () => {
  const { projects, projectsKanbanModal } = useStores();
  const { projectsList, loading, getListData } = projects;

  const handleOpenProject = (id: TUid) => {
    window.open(`/tasks-kanban?projectId=${id}`, '_blank');
  };

  const handleOpenTimeline = (id: TUid) => {
    window.open(`/tasks-timeline?projectId=${id}`, '_blank');
  };

  const tableColumns = useMemo(() => {
    return [
      {
        header: `(${projectsList.length})`,
        style: { width: '2rem' },
        body: (record: TProject) => {
          return (
            <div className="flex align-items-center justify-content-center">
              <div className="pi pi-book" />
            </div>
          );
        },
      },
      {
        header: (
          <TasksStatisticTableHeaderTemplate
            template="Название"
            field={TTaskSortByEnum.title}
          />
        ),
        style: { width: '25rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.title}</EllipsisText>;
        },
      },
      {
        header: (
          <TasksStatisticTableHeaderTemplate
            template="Срок сдачи"
            field={TTaskSortByEnum.title}
          />
        ),
        style: { width: '15rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.deadline}</EllipsisText>;
        },
      },
      {
        header: (
          <TasksStatisticTableHeaderTemplate
            template="Статус"
            field={TTaskSortByEnum.title}
          />
        ),
        style: { width: '15rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.status}</EllipsisText>;
        },
      },
      {
        header: (
          <TasksStatisticTableHeaderTemplate
            template="Ответственный"
            field={TTaskSortByEnum.title}
          />
        ),
        style: { width: '25rem' },
        body: (record: TProject) => {
          return (
            <div className="flex flex-column gap-1">
              <EllipsisText>{record.assignedTeacher.username}</EllipsisText>
              <EllipsisText>{record.assignedTeacher.email}</EllipsisText>
            </div>
          );
        },
      },
      {
        header: 'Студенты',
        body: (record: TProject) => {
          const filteredMap: any[] = [];

          record.assignedStudents?.forEach((student) => {
            if (student.username !== 'Сероштан Кирилл Владимирович') {
              filteredMap.push({
                id: student.id,
                name: student.username,
              });
            }
          });

          return (
            <ChipList
              key={`table-projects-Студенты-${record.id}`}
              id={record.id}
              maxListChips={4}
              showTooltip
              disableMoreButton
              chipItems={filteredMap}
            />
          );
        },
      },
      {
        header: 'Открыть',
        style: { width: '8rem' },
        body: (record: TProject) => {
          return (
            <div className="flex w-min align-items-center gap-2">
              <Button
                outlined
                tooltip="Открыть таймлайн"
                tooltipOptions={{ position: 'top' }}
                icon="pi pi-sliders-h"
                onClick={() => handleOpenTimeline(record.id)}
              />
              <Button
                outlined
                tooltip="Открыть канбан"
                tooltipOptions={{ position: 'top' }}
                icon="pi pi-external-link"
                onClick={() => handleOpenProject(record.id)}
              />
            </div>
          );
        },
      },
    ];
  }, [projectsList]);

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className={styles.tableWrapper}>
      <DataTable
        key="table-projects"
        dataKey="id"
        value={projectsList.length ? toJS(projectsList) : undefined}
        style={{
          maxWidth: '100%',
          minWidth: '100%',
        }}
        className={`fadein animation-duration-500 ${styles.table}`}
        showGridlines
        scrollable
        scrollHeight="flex"
        size="small"
        loading={loading.value}
        loadingIcon={<ProgressSpinner />}
      >
        {tableColumns.map((col, i) => (
          <Column {...col} key={`${i}_${col.header}`} />
        ))}
      </DataTable>
    </div>
  );
};

export default observer(ProjectsTable);
