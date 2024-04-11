import React, { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { TTaskSortByEnum } from 'model/services/tasks/types';
import { Button } from 'primereact/button';

import styles from './styles.module.scss';
import { useStores } from '@control';
import { toJS } from 'mobx';

type Type = {
  template: React.ReactNode;
  field: TTaskSortByEnum;
};

const TasksStatisticTableHeaderTemplate: FC<Type> = ({ template, field }) => {
  const { tasksStatistic } = useStores();
  const { sorters, updateSorters, searchTasks, projectsIds } = tasksStatistic;

  const [isActive, setIsActive] = React.useState(false);
  const [isDesc, setIsDesc] = React.useState(false);

  const handleClickSort = () => setIsActive(!isActive);
  const handleClickArrow = () => setIsDesc(!isDesc);

  useEffect(() => {
    if (!projectsIds.length) return;

    const isExist = !!sorters.find((i) => i.sort_by === field);

    let newSorters = sorters;

    if (isActive) {
      if (isExist) {
        newSorters = sorters.map((i) => {
          if (i.sort_by !== field) return i;
          return {
            ...i,
            sort_order: isDesc ? 1 : -1,
          };
        });
      } else {
        newSorters.push({
          sort_by: field,
          sort_order: isDesc ? 1 : -1,
        });
      }
    } else {
      newSorters = sorters.filter((i) => i.sort_by !== field);
    }

    updateSorters(newSorters);
    searchTasks();
  }, [isActive, isDesc]);

  return (
    <div className={styles.header}>
      <Button
        text
        icon={isActive ? 'pi pi-filter-fill' : 'pi pi-filter'}
        size="small"
        onClick={handleClickSort}
      />
      {isActive && (
        <Button
          text
          icon={isDesc ? 'pi pi-arrow-down' : 'pi pi-arrow-up'}
          size="small"
          onClick={handleClickArrow}
        />
      )}
      <div>{template}</div>
    </div>
  );
};

export default observer(TasksStatisticTableHeaderTemplate);
