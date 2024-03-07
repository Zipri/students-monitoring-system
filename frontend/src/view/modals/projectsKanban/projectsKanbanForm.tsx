import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { TProjectAdd } from 'model/api/projects/types';
import { UsersRolesEnum } from 'model/api/users/types';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';
import { Spin } from '@view/common';
import {
  CalendarController,
  DropdownController,
  InputController,
  InputTextareaController,
} from '@view/form';
import { usePreventEnterSubmit } from '@view/utils';

import styles from './styles.module.scss';

const ProjectsKanbanForm = () => {
  const { projectsKanbanModal } = useStores();
  const {
    changeFormData,
    initialFormData,
    isEditFormMode,
    editingId,
    loading,
    teachers,
    getTeachers,
  } = projectsKanbanModal;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, submitCount },
  } = useForm<Partial<TProjectAdd>>({
    mode: 'onSubmit',
    defaultValues: initialFormData,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;
  const requiredRule = { required: 'Обаятельное поле' };

  const onSubmit = (data: Partial<TProjectAdd>) => {
    // changeFormData(data);
    console.log(data);
  };

  usePreventEnterSubmit(formRef);
  useEffect(() => {
    reset(initialFormData);
  }, [initialFormData]);

  return (
    <Spin blocked={loading.value}>
      <form
        ref={formRef}
        id="projects-kanban-modal-form"
        className={styles.contentWrapper}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputController
          name="title"
          control={formControl}
          errors={errors}
          caption="Название"
          placeholder={'Название проекта'}
          // inputProps={{ style: { width: '15rem' } }}
        />
        <CalendarController
          name="deadline"
          control={formControl}
          errors={errors}
          view="date"
          caption="Срок сдачи"
          calendarProps={{
            placeholder: 'Выберите дату',
            // style: { width: '15rem' },
          }}
        />
        <InputTextareaController
          name="description"
          control={formControl}
          errors={errors}
          caption="Описание"
          placeholder="Описание проекта"
        />
        <DropdownController
          name="assignedTeacher"
          control={formControl}
          options={teachers}
          errors={errors}
          caption="Ответственный"
          dropdownProps={{
            placeholder: UsersRolesEnum.teacher,
            // style: { width: '15rem' },
            loading: loading.value,
            onShow: getTeachers,
            filter: true,
            optionLabel: 'username',
            optionValue: 'id',
          }}
        />
        <DropdownController
          name="assignedTeacher"
          control={formControl}
          options={teachers}
          errors={errors}
          caption="Студенты"
          dropdownProps={{
            placeholder: UsersRolesEnum.student,
            // style: { width: '15rem' },
            loading: loading.value,
            onShow: getTeachers,
            filter: true,
            optionLabel: 'username',
            optionValue: 'id',
          }}
        />
      </form>
    </Spin>
  );
};

export default observer(ProjectsKanbanForm);
