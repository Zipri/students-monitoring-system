import React, { useEffect, useRef } from 'react';

import { TTaskModalStore } from 'control/stores/modals/task/types';
import { observer } from 'mobx-react-lite';
import { TaskPriorityEnum, TaskStatusEnum } from 'model/api/tasks/types';
import { classNames } from 'primereact/utils';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';
import { Spin } from '@view/common';
import {
  CalendarController,
  DropdownController,
  FormFooter,
  InputController,
  InputTextareaController,
} from '@view/form';
import { usePreventEnterSubmit } from '@view/utils';

import styles from './styles.module.scss';

const TaskForm = () => {
  const { taskModal, projectFiltersWithUrl } = useStores();
  const {
    closeModal,
    changeFormData,
    initialFormData,
    isEditFormMode,
    editingId,
    loading,
  } = taskModal;
  const { project } = projectFiltersWithUrl;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, submitCount },
  } = useForm<TTaskModalStore>({
    mode: 'onSubmit',
    defaultValues: initialFormData,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;
  const requiredRule = { required: 'Обаятельное поле' };

  const onSubmit = (data: TTaskModalStore) => {
    changeFormData(data);
  };

  const handleCloseEditMode = () => {
    if (loading.value) return;
    isEditFormMode.disable();
  };

  usePreventEnterSubmit(formRef);
  useEffect(() => {
    reset(initialFormData);
  }, [initialFormData]);

  return (
    <Spin blocked={loading.value} width="w-full">
      <form
        ref={formRef}
        id="task-modal-form"
        className={classNames(styles.formWrapper, styles.activeForm)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputController
          name="title"
          control={formControl}
          errors={errors}
          caption="Название"
          placeholder={'Название задачи'}
          rules={requiredRule}
        />
        <InputTextareaController
          name="description"
          control={formControl}
          errors={errors}
          caption="Описание"
          placeholder={'Описание задачи'}
          rules={requiredRule}
        />
        <DropdownController
          name="status"
          control={formControl}
          options={Object.values(TaskStatusEnum)}
          errors={errors}
          caption="Статус"
          dropdownProps={{
            placeholder: 'Выберите статус',
          }}
        />
        <DropdownController
          name="priority"
          control={formControl}
          options={Object.values(TaskPriorityEnum)}
          errors={errors}
          caption="Приоритет"
          dropdownProps={{
            placeholder: 'Выберите приоритет',
          }}
        />
        <CalendarController
          name="startDate"
          control={formControl}
          errors={errors}
          view="date"
          caption="Дата начала выполнения задачи"
          calendarProps={{
            placeholder: 'Выберите дату',
            minDate: new Date(project?.startDate || ''),
            viewDate: new Date(project?.startDate || ''),
            maxDate: new Date(project?.deadline || ''),
          }}
          rules={requiredRule}
        />
        <CalendarController
          name="deadline"
          control={formControl}
          errors={errors}
          view="date"
          caption="Дата завершения выполнения задачи"
          calendarProps={{
            placeholder: 'Выберите дату',
            minDate: new Date(project?.startDate || ''),
            viewDate: new Date(project?.startDate || ''),
            maxDate: new Date(project?.deadline || ''),
          }}
          rules={requiredRule}
        />
        <FormFooter
          form="task-modal-form"
          loading={loading}
          disableSubmit={loading.value}
          handleCloseModal={handleCloseEditMode}
        />
      </form>
    </Spin>
  );
};

export default observer(TaskForm);
