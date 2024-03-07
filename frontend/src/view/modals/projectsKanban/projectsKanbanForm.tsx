import { useEffect, useRef } from 'react';

import { observer } from 'mobx-react-lite';
import { TProjectAdd } from 'model/api/projects/types';
import { UsersRolesEnum } from 'model/api/users/types';
import { Control, useForm } from 'react-hook-form';

import { useStores } from '@control';
import { Spin } from '@view/common';
import {
  AutocompleteController,
  CalendarController,
  InputController,
  InputTextareaController,
  MultiAutocompleteController,
} from '@view/form';
import { usePreventEnterSubmit } from '@view/utils';

import styles from './styles.module.scss';
import { Button } from 'primereact/button';
import FormLabel from 'view/common-form/formLabel/formLabel';
import { TProjectsKanbanModalStore } from 'control/stores/modals/projectsKanban/types';

const ProjectsKanbanForm = () => {
  const {
    projectsKanbanModal,
    user: { info },
  } = useStores();
  const {
    changeFormData,
    initialFormData,
    isEditFormMode,
    editingId,
    loading,
    teachersAutocomplete,
    studentsAutocomplete,
  } = projectsKanbanModal;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, submitCount },
  } = useForm<TProjectsKanbanModalStore>({
    mode: 'onSubmit',
    defaultValues: initialFormData,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const formControl = control as unknown as Control<Record<string, any>>;
  const requiredRule = { required: 'Обаятельное поле' };

  const onSubmit = (data: TProjectsKanbanModalStore) => {
    //@ts-expect-error проверка проходит на уровне валидации UI
    changeFormData(data);
    // console.log(data);
  };

  const handleSelfChooseTeacher = () => {
    teachersAutocomplete.getOptions();
    setValue('assignedTeacher', info.id);
  };

  const handleSelfChooseStudent = () => {
    studentsAutocomplete.getOptions();
    setValue('assignedStudents', [info.id]);
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
          rules={requiredRule}
        />
        <CalendarController
          name="deadline"
          control={formControl}
          errors={errors}
          view="date"
          caption="Срок сдачи"
          rules={requiredRule}
          calendarProps={{
            placeholder: 'Выберите дату',
          }}
        />
        <InputTextareaController
          name="description"
          control={formControl}
          errors={errors}
          caption="Описание"
          placeholder="Описание проекта"
        />
        <div className="w-full flex flex-column gap-2">
          <FormLabel
            htmlFor="assignedTeacher"
            caption="Ответственный"
            required
            bold
          />
          <div className="w-full flex align-items-center gap-2">
            <AutocompleteController
              name="assignedTeacher"
              control={formControl}
              autocompleteController={teachersAutocomplete}
              errors={errors}
              rules={requiredRule}
              width="100%"
              dropdownProps={{
                placeholder: UsersRolesEnum.teacher,
              }}
            />
            {info.role === UsersRolesEnum.teacher && (
              <Button
                onClick={handleSelfChooseTeacher}
                type="button"
                style={{ width: '11rem' }}
                outlined
                label="Выбрать себя"
              />
            )}
          </div>
        </div>
        <div className="w-full flex flex-column gap-2">
          <FormLabel
            htmlFor="assignedStudents"
            caption="Студенты"
            required
            bold
          />
          <div className="w-full flex align-items-center gap-2">
            <MultiAutocompleteController
              name="assignedStudents"
              control={formControl}
              autocompleteController={studentsAutocomplete}
              errors={errors}
              rules={requiredRule}
              width="100%"
              multiSelectProps={{
                placeholder: UsersRolesEnum.student,
              }}
            />
            {info.role === UsersRolesEnum.student && (
              <Button
                onClick={handleSelfChooseStudent}
                type="button"
                style={{ width: '11rem' }}
                outlined
                label="Выбрать себя"
              />
            )}
          </div>
        </div>
      </form>
    </Spin>
  );
};

export default observer(ProjectsKanbanForm);
