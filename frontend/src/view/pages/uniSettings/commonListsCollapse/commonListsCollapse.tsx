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
import { ProjectsStatusesEnum } from 'model/api/projects/types';
import { TaskPriorityEnum, TaskStatusEnum } from 'model/api/tasks/types';
import { v4 } from 'uuid';

const mockData = {
  disciplines: [
    'Основы программирования',
    'Алгоритмы и структуры данных',
    'Теория вероятностей и математическая статистика',
    'Операционные системы',
    'Системное программное обеспечение',
    'Базы данных',
    'Объектно-ориентированное программирование',
    'Веб-программирование',
    'Интерфейсы компьютерных систем',
    'Компьютерные сети',
    'Искусственный интеллект',
    'Машинное обучение',
    'Компьютерная графика',
    'Программирование мобильных устройств',
    'Кибербезопасность',
    'Системный анализ и моделирование',
    'Программное обеспечение встроенных систем',
    'Разработка программного обеспечения',
    'Проектирование информационных систем',
    'Тестирование программного обеспечения',
  ],
  projectStatuses: Object.values(ProjectsStatusesEnum),
  taskStatuses: Object.values(TaskStatusEnum),
  taskPriority: Object.values(TaskPriorityEnum),
  rights: [
    {
      name: 'Преподаватель',
      rights: [
        { id: v4(), name: 'Просмотр и редактирование своих проектов и задач' },
        { id: v4(), name: 'Подтверждение задач студентов' },
        { id: v4(), name: 'Доступ к настройкам вуза' },
      ],
    },
    {
      name: 'Студент',
      rights: [
        { id: v4(), name: 'Просмотр и редактирование своих проектов и задач' },
      ],
    },
  ],
};

const UniSettingsCommonListsCollapse = () => {
  const { uniSettings } = useStores();
  const { teachers, students } = uniSettings;

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

  const item = (label: string, array: string[]) => (
    <div className="flex flex-column gap-2">
      <div className="flex align-items-center gap-2">
        <InputText placeholder="Поиск" />
        <Button
          type="submit"
          outlined
          icon="pi pi-search"
          tooltip="Для поиска можно также нажать Enter"
          tooltipOptions={{ position: 'top' }}
        />
        <InputText placeholder={label} />
        <Button
          severity="success"
          label="Добавить"
          onClick={() => console.log('')}
        />
      </div>
      <div className={styles.listS}>
        {array.map((item) => {
          return (
            <div className={styles.item} key={v4()}>
              <FormLabel htmlFor={label} caption={item} bold />
              <div className="flex align-items-center gap-2">
                <Button
                  outlined
                  tooltip="Редактировать"
                  tooltipOptions={{ position: 'top' }}
                  icon="pi pi-file-edit"
                />
                <Button
                  outlined
                  severity="danger"
                  tooltip="Удалить"
                  tooltipOptions={{ position: 'top' }}
                  icon="pi pi-trash"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Spin blocked={false} className="flex flex-column gap-4">
      {item('Введите дисциплину', mockData.disciplines)}
      {item('Введите статус проекта', mockData.projectStatuses)}
      {item('Введите статус задания', mockData.taskStatuses)}
      {item('Введите приоритет задания', mockData.taskPriority)}
      <div className="flex flex-column gap-2">
        <div className="flex align-items-center gap-2">
          <InputText placeholder="Роль" />
          <InputText placeholder="Права" />
          <Button
            type="submit"
            outlined
            icon="pi pi-search"
            tooltip="Для поиска можно также нажать Enter"
            tooltipOptions={{ position: 'top' }}
          />
          <InputText placeholder="Роль" />
          <Dropdown
            placeholder="Выберите права"
            options={[
              {
                id: v4(),
                name: 'Просмотр и редактирование своих проектов и задач',
              },
              { id: v4(), name: 'Подтверждение задач студентов' },
              { id: v4(), name: 'Доступ к настройкам вуза' },
            ]}
            filter
            multiple
            optionLabel={'name'}
            optionValue={'id'}
          />
          <Button
            severity="success"
            label="Добавить"
            onClick={() => console.log('')}
          />
        </div>
        <div className={styles.listS}>
          {mockData.rights.map((item) => {
            return (
              <div className={styles.item} key={v4()}>
                <FormLabel htmlFor={'rights'} caption={item.name} bold />
                <ChipList
                  key={`rights`}
                  id={'rights'}
                  maxListChips={3}
                  showTooltip
                  disableMoreButton
                  chipItems={item.rights}
                />
                {item.name === 'Студент' ? (
                  <ChipList
                    key={`students`}
                    id={'students'}
                    maxListChips={1}
                    showTooltip
                    disableMoreButton
                    chipItems={students.map((i) => ({
                      id: i.id,
                      name: i.username,
                    }))}
                  />
                ) : (
                  <ChipList
                    key={`teachers`}
                    id={'teachers'}
                    maxListChips={1}
                    showTooltip
                    disableMoreButton
                    chipItems={teachers.map((i) => ({
                      id: i.id,
                      name: i.username,
                    }))}
                  />
                )}
                <div className="flex align-items-center gap-2">
                  <Button
                    outlined
                    tooltip="Редактировать"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-file-edit"
                  />
                  <Button
                    outlined
                    severity="danger"
                    tooltip="Удалить"
                    tooltipOptions={{ position: 'top' }}
                    icon="pi pi-trash"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Spin>
  );
};

export default observer(UniSettingsCommonListsCollapse);
