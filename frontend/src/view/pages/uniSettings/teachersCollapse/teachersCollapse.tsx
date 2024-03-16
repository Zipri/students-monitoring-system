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

const UniSettingsTeachersCollapse = () => {
  const { uniSettings } = useStores();
  const { loadingTeachers, teachers } = uniSettings;

  const [editingId, setEditingId] = useState<TUid>('');

  return (
    <Spin blocked={loadingTeachers.value} className="flex flex-column gap-2">
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
                <div className={styles.item}>
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
                      onClick={() => console.log(teacher.id)}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={styles.item}>
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
                    onClick={() => console.log(teacher.id)}
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
