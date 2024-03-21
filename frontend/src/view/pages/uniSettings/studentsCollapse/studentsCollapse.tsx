import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { TUser, UsersRolesEnum } from 'model/api/users/types';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { TUid } from '@api/types';
import { projectsKanbanColorSchema } from '@config';
import { useStores } from '@control';
import { Spin } from '@view/common';
import { FormLabel } from '@view/form';

import styles from '../styles.module.scss';

const colorSchema = projectsKanbanColorSchema;

const UniSettingsStudentsCollapse = () => {
  const { uniSettings } = useStores();
  const {
    loadingStudents,
    students,
    groupsAutocomplete,
    loadingProjects,
    getProjects,
  } = uniSettings;

  const [editingId, setEditingId] = useState<TUid>('');

  const confirmDeleteItem = async (student: TUser) => {
    const userProjects = await getProjects(student.id, UsersRolesEnum.student);

    confirmDialog({
      message: userProjects ? (
        <div className="flex flex-column gap-2">
          <div>
            При удалении студента, его профиль удалится из группы и всех
            проектов, в которые он бал добавлен:
          </div>
          {userProjects.map((project) => (
            <div key={project.id} className="flex align-items-center gap-2">
              <div>·</div>
              <div style={colorSchema[project.status].header}>
                ({project.status})
              </div>
              <FormLabel htmlFor={project.title} caption={project.title} bold />
              <div className="flex align-items-center gap-1 text-400">
                <div>[{project.startDate}</div>
                <div>-</div>
                <div>{project.deadline}]</div>
              </div>
            </div>
          ))}
        </div>
      ) : undefined,
      header: `Подтверждение удаления студента ${student.username}, ${student.group}`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => console.log(student.id),
    });
  };

  return (
    <Spin
      blocked={loadingStudents.value || loadingProjects.value}
      className="flex flex-column gap-2"
    >
      <div className="w-full">
        <span className="w-full p-input-icon-left">
          <i className="pi pi-search" />
          <InputText className="w-full" placeholder="Поиск по ФИО" />
        </span>
      </div>
      {students && (
        <div className={styles.list}>
          {students.map((student) => {
            if (editingId === student.id) {
              return (
                <div className={styles.item} key={student.id}>
                  <InputText
                    value={student.username}
                    placeholder="Введите ФИО"
                  />
                  <InputText
                    value={student.email}
                    placeholder="Введите email"
                  />
                  <Dropdown
                    placeholder="Выберите Группу"
                    options={groupsAutocomplete.list}
                    //   value={field.value}
                    //   onChange={(e) => field.onChange(e.target.value)}
                    filter
                    multiple
                    loading={groupsAutocomplete.loading.value}
                    onShow={groupsAutocomplete.getOptions}
                    optionLabel={'name'}
                    optionValue={'id'}
                  />
                  <div className="flex align-items-center gap-2">
                    <Button
                      outlined
                      severity="warning"
                      tooltip="Отмена"
                      tooltipOptions={{ position: 'top' }}
                      icon="pi pi-refresh"
                      onClick={() => setEditingId('')}
                    />
                    <Button
                      outlined
                      severity="danger"
                      tooltip="Удалить"
                      tooltipOptions={{ position: 'top' }}
                      icon="pi pi-trash"
                      onClick={() => confirmDeleteItem(student)}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={styles.item} key={student.id}>
                <FormLabel
                  htmlFor={'UniSettingsStudentsCollapse-student.username'}
                  caption={student.username}
                  bold
                />
                <FormLabel
                  htmlFor={'UniSettingsStudentsCollapse-student.email'}
                  caption={student.email}
                  bold
                />
                <FormLabel
                  htmlFor={'UniSettingsStudentsCollapse-student.group'}
                  caption={student.group || 'Группа не задана'}
                  bold
                />
                <div className="flex align-items-center gap-2">
                  <Button
                    outlined
                    tooltip="Редактировать"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-file-edit"
                    onClick={() => setEditingId(student.id)}
                  />
                  <Button
                    outlined
                    severity="danger"
                    tooltip="Удалить"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-trash"
                    onClick={() => confirmDeleteItem(student)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Spin>
  );
};

export default observer(UniSettingsStudentsCollapse);
