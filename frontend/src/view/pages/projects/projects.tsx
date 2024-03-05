import { useEffect, useMemo } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useStores } from '@control';
import { EllipsisText } from '@view/common';

import styles from './styles.module.scss';

const Projects = () => {
  const { projects } = useStores();
  const { projectsList, loading, getListData } = projects;

  const tableColumns = useMemo(() => {
    return [
      {
        header: 'Название',
        body: (record: TProject) => {
          return <EllipsisText>{record.title}</EllipsisText>;
        },
      },
      {
        header: 'Срок сдачи',
        style: { width: '25rem' },
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
    ];
  }, []);

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div>
      <div className={styles.tableWrapper}>
        <DataTable
          key={`table-projects`}
          dataKey="id"
          value={projectsList.length ? toJS(projectsList) : undefined}
          style={{
            maxWidth: '100%',
            minWidth: '100%',
            maxHeight: '30rem',
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
    </div>
  );
};

export default observer(Projects);
