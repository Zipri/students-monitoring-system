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

const UniSettingsStudentsCollapse = () => {
  const { uniSettings } = useStores();
  const { loadingStudents, students, groupsAutocomplete } = uniSettings;

  const [editingId, setEditingId] = useState<TUid>('');

  return (
    <Spin blocked={loadingStudents.value} className="flex flex-column gap-2">
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
                <div className={styles.item}>
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
                      onClick={() => console.log(student.id)}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={styles.item}>
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
                    onClick={() => console.log(student.id)}
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
