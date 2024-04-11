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
        header: 'Название',
        style: { width: '25rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.title}</EllipsisText>;
        },
      },
      {
        header: 'Срок сдачи',
        style: { width: '15rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.deadline}</EllipsisText>;
        },
      },
      {
        header: 'Статус',
        style: { width: '15rem' },
        body: (record: TProject) => {
          return <EllipsisText>{record.status}</EllipsisText>;
        },
      },
      {
        header: 'Ответственный',
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
          return (
            <ChipList
              key={`table-projects-Студенты-${record.id}`}
              id={record.id}
              maxListChips={4}
              showTooltip
              disableMoreButton
              chipItems={
                record.assignedStudents?.map((i) => ({
                  id: i.id,
                  name: i.username,
                })) || []
              }
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
                tooltip="Открыть"
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
