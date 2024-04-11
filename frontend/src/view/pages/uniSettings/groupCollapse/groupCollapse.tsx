import { useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { TUid } from '@api/types';
import { useStores } from '@control';
import { ChipList, Spin } from '@view/common';
import { FormLabel } from '@view/form';

import styles from '../styles.module.scss';
import { confirmDialog } from 'primereact/confirmdialog';
import { TGroup } from 'model/api/groups/types';

const UniSettingsGroupCollapse = () => {
  const { uniSettings } = useStores();
  const { loadingGroups, groups, studentsAutocomplete, getStudentsByGroup } =
    uniSettings;

  const [editingId, setEditingId] = useState<TUid>('');

  const confirmDeleteItem = async (group: TGroup) => {
    const students = group.students;

    confirmDialog({
      message: students ? (
        <div className="flex flex-column gap-2">
          <div>
            При удалении группы, будут удалены все студенты этой группы:
          </div>
          {students.map((student) => (
            <div key={student.id} className="flex align-items-center gap-2">
              <div>·</div>
              <FormLabel htmlFor={student.name} caption={student.name} bold />
            </div>
          ))}
        </div>
      ) : undefined,
      header: `Подтверждение удаления группы ${group.name}`,
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => console.log(group.id),
    });
  };

  return (
    <Spin blocked={loadingGroups.value} className="flex flex-column gap-2">
      <div className="flex align-items-center gap-2">
        <InputText placeholder="Введите группу" />
        <Dropdown
          placeholder="Выберите студентов"
          options={studentsAutocomplete.list}
          //   value={field.value}
          //   onChange={(e) => field.onChange(e.target.value)}
          filter
          multiple
          loading={studentsAutocomplete.loading.value}
          onShow={studentsAutocomplete.getOptions}
          optionLabel={'name'}
          optionValue={'id'}
        />
        <Button
          severity="warning"
          label="Сбросить"
          onClick={() => console.log('')}
        />
        <Button
          severity="success"
          label="Добавить"
          onClick={() => console.log('')}
        />
      </div>
      <div className="w-full">
        <span className="w-full p-input-icon-left">
          <i className="pi pi-search" />
          <InputText className="w-full" placeholder="Поиск по группе" />
        </span>
      </div>
      {groups && (
        <div className={styles.list}>
          {groups.map((group) => {
            if (editingId === group.id) {
              return (
                <div className={styles.item}>
                  <InputText value={group.name} placeholder="Введите группу" />
                  <Dropdown
                    placeholder="Выберите студентов"
                    options={studentsAutocomplete.list}
                    //   value={field.value}
                    //   onChange={(e) => field.onChange(e.target.value)}
                    filter
                    multiple
                    loading={studentsAutocomplete.loading.value}
                    onShow={studentsAutocomplete.getOptions}
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
                      onClick={() => confirmDeleteItem(group)}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={styles.item}>
                <FormLabel
                  htmlFor={'Управление группами'}
                  caption={group.name}
                  bold
                />
                <ChipList
                  key={`UniSettings-Управление группами`}
                  id={'Управление группами'}
                  maxListChips={3}
                  showTooltip
                  disableMoreButton
                  chipItems={group.students}
                />
                <div className="flex align-items-center gap-2">
                  <Button
                    outlined
                    tooltip="Редактировать"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-file-edit"
                    onClick={() => setEditingId(group.id)}
                  />
                  <Button
                    outlined
                    severity="danger"
                    tooltip="Удалить"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-trash"
                    onClick={() => confirmDeleteItem(group)}
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

export default observer(UniSettingsGroupCollapse);
