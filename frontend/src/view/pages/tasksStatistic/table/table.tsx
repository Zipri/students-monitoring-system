import { useMemo } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { TaskPriorityEnum, TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tooltip } from 'primereact/tooltip';
import { ChipItem } from 'view/common/chipList/chipItem';

import { TUid } from '@api/types';
import { useStores } from '@control';
import { ChipList, EllipsisText } from '@view/common';

import styles from './styles.module.scss';
import {
  TasksStatisticTableProjectTemplate,
  TasksStatisticTableSkippedTemplate,
  TasksStatisticTableWastedTemplate,
} from './templates';

const countTasksByStatus = (tasks: TTask[]) => {
  return Object.values(TaskStatusEnum).map((status) => {
    const count = tasks.filter((task) => task.status === status).length;
    return {
      id: status,
      name: `${status}: ${count}`,
    };
  });
};

const countTasksByPriority = (tasks: TTask[]) => {
  return Object.values(TaskPriorityEnum).map((priority) => {
    const count = tasks.filter((task) => task.priority === priority).length;
    return {
      id: priority,
      name: `${priority}: ${count}`,
    };
  });
};

const TasksStatisticTable = () => {
  const { tasksStatistic, taskModal } = useStores();
  const { tasks, loading, projects, searchTasks } = tasksStatistic;

  const handleOpenProject = (taskId: TUid, projectId: TUid) => {
    taskModal.openEdit(searchTasks, taskId, projectId);
  };

  const handleOpenTimeline = (id: TUid) => {
    window.open(`/tasks-timeline?projectId=${id}`, '_blank');
  };

  const helpTableColumns = useMemo(() => {
    return [
      {
        header: 'Количество задач',
        body: () => {
          return (
            <ChipItem
              id={(tasks.length + 1).toString()}
              template={`Выбранных задач: ${tasks.length}`}
            />
          );
        },
      },
      {
        header: 'Статистика по статусам',
        body: () => {
          const newTasks = countTasksByStatus(tasks);
          return (
            <ChipList
              key={`TasksStatisticTable-countTasksByStatus-${tasks.length}`}
              id={tasks.length.toString()}
              maxListChips={4}
              chipItems={newTasks}
            />
          );
        },
      },
      {
        header: 'Статистика по приоритетам',
        body: () => {
          const newTasks = countTasksByPriority(tasks);
          return (
            <ChipList
              key={`TasksStatisticTable-countTasksByPriority-${tasks.length}`}
              id={tasks.length.toString()}
              maxListChips={4}
              chipItems={newTasks}
            />
          );
        },
      },
      {
        header: (
          <div className="flex align-items-center gap-1">
            <Tooltip
              target=".custom-target-question"
              position="top"
              content="Задача считается просроченной, если срок сдачи прошел, а статус
                задачи не завершен"
            />
            <span>Количество просроченных задач</span>
            <div className="pi pi-question-circle cursor-pointer custom-target-question" />
          </div>
        ),
        body: () => {
          return <TasksStatisticTableWastedTemplate tasks={tasks} />;
        },
      },
      {
        header: (
          <div className="flex align-items-center gap-1">
            <Tooltip
              target=".custom-target-пропущенных"
              position="top"
              content='Задача считается пропущенной, если дата начала задачи уже прошла, а статус задачи "Новая" и проект не имеет статус "Отложен"'
            />
            <span>Количество пропущенных задач</span>
            <div className="pi pi-question-circle cursor-pointer custom-target-пропущенных" />
          </div>
        ),
        body: () => {
          return (
            <TasksStatisticTableSkippedTemplate
              tasks={tasks}
              projects={projects}
            />
          );
        },
      },
    ];
  }, [tasks]);

  const tableColumns = useMemo(() => {
    return [
      {
        header: 'Название',
        style: { width: '25rem' },
        body: (record: TTask) => {
          return <EllipsisText>{record.title}</EllipsisText>;
        },
      },
      {
        header: 'Статус',
        style: { width: '20rem' },
        body: (record: TTask) => {
          return <EllipsisText>{record.status}</EllipsisText>;
        },
      },
      {
        header: 'Приоритет',
        style: { width: '20rem' },
        body: (record: TTask) => {
          return <EllipsisText>{record.priority}</EllipsisText>;
        },
      },
      {
        header: 'Начало выполнения',
        style: { width: '13rem' },
        body: (record: TTask) => {
          return <EllipsisText>{record.startDate}</EllipsisText>;
        },
      },
      {
        header: 'Срок сдачи',
        style: { width: '13rem' },
        body: (record: TTask) => {
          return <EllipsisText>{record.deadline}</EllipsisText>;
        },
      },
      {
        header: 'Проект задачи',
        style: { width: '20rem' },
        body: (record: TTask) => {
          return (
            <TasksStatisticTableProjectTemplate
              record={record}
              projects={projects}
            />
          );
        },
      },
      {
        header: 'Открыть',
        style: { width: '8rem' },
        body: (record: TTask) => {
          return (
            <div className="flex w-min align-items-center gap-2">
              <Button
                outlined
                tooltip="Открыть таймлайн проекта"
                tooltipOptions={{ position: 'top' }}
                icon="pi pi-sliders-h"
                onClick={() => handleOpenTimeline(record.projectId)}
              />
              <Button
                outlined
                tooltip="Открыть задачу"
                tooltipOptions={{ position: 'top' }}
                icon="pi pi-external-link"
                onClick={() => handleOpenProject(record.id, record.projectId)}
              />
            </div>
          );
        },
      },
    ];
  }, [tasks]);

  return (
    <div className={styles.commonWrapper}>
      <DataTable
        key={`table-projects`}
        dataKey="id"
        value={tasks.length ? toJS([tasks[0]]) : undefined}
        style={{
          maxWidth: '100%',
          minWidth: '100%',
        }}
        className={`fadein animation-duration-500 ${styles.table}`}
        showGridlines
        scrollable
        size="small"
        loading={loading.value}
        loadingIcon={<ProgressSpinner />}
      >
        {helpTableColumns.map((col, i) => (
          <Column {...col} key={`${i}_${col.header}`} />
        ))}
      </DataTable>

      <div className={styles.tableWrapper}>
        <DataTable
          key={`table-projects`}
          dataKey="id"
          value={tasks.length ? toJS(tasks) : undefined}
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
    </div>
  );
};

export default observer(TasksStatisticTable);
