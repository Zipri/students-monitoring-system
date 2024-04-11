import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { TUid } from '@api/types';
import { useStores } from '@control';
import { Spin } from '@view/common';
import { FormLabel } from '@view/form';

import styles from '../styles.module.scss';
import { confirmDialog } from 'primereact/confirmdialog';
import { TUser, UsersRolesEnum } from 'model/api/users/types';
import { projectsKanbanColorSchema } from '@config';

const colorSchema = projectsKanbanColorSchema;

const UniSettingsTeachersCollapse = () => {
  const { uniSettings } = useStores();
  const { loadingProjects, loadingTeachers, teachers, getProjects } =
    uniSettings;

  const [editingId, setEditingId] = useState<TUid>('');

  const confirmDeleteItem = async (teacher: TUser) => {
    const userProjects = await getProjects(teacher.id, UsersRolesEnum.teacher);

    confirmDialog({
      message: userProjects ? (
        <div className="flex flex-column gap-2">
          <div>
            При удалении преподавателя, его профиль удалится из всех проектов, в
            которые он бал добавлен:
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
      header: `Подтверждение удаления преподавателя ${teacher.username}`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => console.log(teacher.id),
    });
  };

  return (
    <Spin
      blocked={loadingTeachers.value || loadingProjects.value}
      className="flex flex-column gap-2"
    >
      <div className="w-full">
        <span className="w-full p-input-icon-left">
          <i className="pi pi-search" />
          <InputText className="w-full" placeholder="Поиск по ФИО" />
        </span>
      </div>
      {teachers && (
        <div className={styles.list}>
          {teachers.map((teacher) => {
            if (editingId === teacher.id) {
              return (
                <div className={styles.item} key={teacher.id}>
                  <InputText
                    value={teacher.username}
                    placeholder="Введите ФИО"
                  />
                  <InputText
                    value={teacher.email}
                    placeholder="Введите email"
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
                      onClick={() => confirmDeleteItem(teacher)}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={styles.item} key={teacher.id}>
                <FormLabel
                  htmlFor={'UniSettingsStudentsCollapse-student.username'}
                  caption={teacher.username}
                  bold
                />
                <FormLabel
                  htmlFor={'UniSettingsStudentsCollapse-student.email'}
                  caption={teacher.email}
                  bold
                />
                <div className="flex align-items-center gap-2">
                  <Button
                    outlined
                    tooltip="Редактировать"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-file-edit"
                    onClick={() => setEditingId(teacher.id)}
                  />
                  <Button
                    outlined
                    severity="danger"
                    tooltip="Удалить"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-trash"
                    onClick={() => confirmDeleteItem(teacher)}
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

export default observer(UniSettingsTeachersCollapse);
