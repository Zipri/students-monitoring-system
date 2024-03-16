import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import {
  ProjectsStatusesEnum,
  TProjectSearchParams,
} from 'model/api/projects/types';
import { UsersRolesEnum } from 'model/api/users/types';
import { Button } from 'primereact/button';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';
import {
  CalendarController,
  DropdownController,
  InputController,
} from '@view/form';

import styles from './styles.module.scss';

const options = Object.values(ProjectsStatusesEnum); // FIXME SKV вынести в конфиг

const ProjectsFilters = () => {
  const { projects } = useStores();
  const {
    teachers,
    initialFormData,
    loadingDropdown,
    filterListData,
    resetFilters,
    getTeachers,
  } = projects;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TProjectSearchParams>({
    mode: 'onSubmit',
    defaultValues: initialFormData,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;

  const onSubmit = (data: TProjectSearchParams) => {
    filterListData(data);
  };

  useEffect(() => {
    reset(initialFormData);
  }, [initialFormData]);

  // TODO применить хук с горизонтальным скролом
  return (
    <div className={styles.formWrapper}>
      <form
        ref={formRef}
        id="table-projects-form-filters"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap align-items-center gap-2">
          <InputController
            name="title"
            control={formControl}
            errors={errors}
            placeholder={'Название проекта'}
            inputProps={{ style: { width: '15rem' } }}
          />
          <DropdownController
            name="status"
            control={formControl}
            options={options}
            errors={errors}
            dropdownProps={{
              placeholder: 'Выберите статус',
              style: { width: '15rem' },
            }}
          />
          <CalendarController
            name="deadline"
            control={formControl}
            errors={errors}
            view="date"
            calendarProps={{
              placeholder: 'Выберите дату',
              style: { width: '15rem' },
            }}
          />
          <DropdownController
            name="assignedTeacher"
            control={formControl}
            options={teachers}
            errors={errors}
            dropdownProps={{
              placeholder: UsersRolesEnum.teacher,
              style: { width: '15rem' },
              loading: loadingDropdown.value,
              onShow: getTeachers,
              filter: true,
              optionLabel: 'username',
              optionValue: 'id',
            }}
          />
          <div className="flex gap-2 align-items-center">
            <Button
              type="button"
              severity="danger"
              label={'Сбросить'}
              onClick={resetFilters}
            />
            <Button
              type="submit"
              label={'Поиск'}
              form={'table-projects-form-filters'}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default observer(ProjectsFilters);
