import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import {
  TTaskFilterParams,
  TaskPriorityEnum,
  TaskStatusEnum,
} from 'model/api/tasks/types';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';
import { useHorizontalScroll } from '@view/utils';

import styles from './styles.module.scss';
import {
  CalendarController,
  DropdownController,
  InputController,
} from '@view/form';
import { toJS } from 'mobx';
import { Button } from 'primereact/button';

const TasksStatisticFilters = () => {
  const { tasksStatistic } = useStores();
  const { loading, filters, updateFilters, searchTasks } = tasksStatistic;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TTaskFilterParams>({
    mode: 'onSubmit',
    defaultValues: filters,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;

  const onSubmit = (data: TTaskFilterParams) => {
    updateFilters(data);
    searchTasks();
  };

  const resetFilters = () => {
    updateFilters({});
    searchTasks();
  };

  useEffect(() => {
    reset(filters);
  }, [filters]);

  useHorizontalScroll('TasksStatisticFilters-filters-wrapper');

  return (
    <div
      id="TasksStatisticFilters-filters-wrapper"
      className={styles.formWrapper}
    >
      <form
        ref={formRef}
        id="table-TasksStatisticFilters-form-filters"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex align-items-center gap-2">
          <InputController
            name="title"
            control={formControl}
            errors={errors}
            placeholder={'Название задачи'}
            inputProps={{ style: { width: '15rem' } }}
          />
          <DropdownController
            name="status"
            control={formControl}
            options={Object.values(TaskStatusEnum)}
            errors={errors}
            dropdownProps={{
              placeholder: 'Выберите статус',
            }}
          />
          <DropdownController
            name="priority"
            control={formControl}
            options={Object.values(TaskPriorityEnum)}
            errors={errors}
            dropdownProps={{
              placeholder: 'Выберите приоритет',
            }}
          />
          <CalendarController
            name="startDate"
            control={formControl}
            errors={errors}
            view="date"
            calendarProps={{
              placeholder: 'Выберите дату начала',
              style: { width: '19rem' },
            }}
          />
          <CalendarController
            name="deadline"
            control={formControl}
            errors={errors}
            view="date"
            calendarProps={{
              placeholder: 'Выберите дату завершения',
              style: { width: '19rem' },
            }}
          />
          <div className="flex gap-2 align-items-center">
            <Button
              type="button"
              outlined
              severity="warning"
              icon="pi pi-replay"
              tooltip="Сбросить"
              tooltipOptions={{ position: 'top' }}
              onClick={resetFilters}
            />
            <Button
              type="submit"
              outlined
              icon="pi pi-search"
              tooltip="Для поиска можно также нажать Enter"
              tooltipOptions={{ position: 'top' }}
              form={'table-TasksStatisticFilters-form-filters'}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default observer(TasksStatisticFilters);
