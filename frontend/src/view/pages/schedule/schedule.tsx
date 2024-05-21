import { classNames } from 'primereact/utils';

import { EllipsisText } from '@view/common';

import styles from './styles.module.scss';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useStores } from '@control';
import { useState } from 'react';
import { TUserRegistration, UsersRolesEnum } from 'model/api/users/types';
import { TUid } from '@api/types';
import { FormLabel } from '@view/form';

const emptyNewUser: TUserRegistration = {
  username: '',
  email: '',
  password: '',
  role: UsersRolesEnum.student,
  group: undefined,
  groupId: undefined,
};

type ScheduleItem = {
  day: string;
  time: string;
  type?: 'Лекция' | 'Семинар';
  subject?: string;
  room?: string;
  teacher?: string;
};

const scheduleData: ScheduleItem[] = [
  {
    day: 'ПН',
    time: '08:30 - 10:05',
    type: 'Семинар',
    subject: 'Методы проектирования корпоративных информационных систем',
    room: '392',
    teacher: 'Гаврилова Е. Ю.',
  },
  // Добавьте остальные строки расписания здесь
];

type TDayData = {
  time: string;
  type: number;
  data: string;
  data2: string;
};

//#region mock
const monday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '(сем) Методы проектирования корпоративных информационных систем 392 Гаврилова Е. Ю.',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '17:25 - 19:00',
    type: 3,
    data: '(лек) Методы проектирования корпоративных информационных систем 432 Березкин Д. В.',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 3,
    data: '(лек) Облачные технологии 432 Пономарев А. Д.',
    data2: '',
  },
];

const tuesday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '(сем) Методы проектирования корпоративных информационных систем 392 Гаврилова Е. Ю.',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 4,
    data: '(лек) Методы проектирования корпоративных информационных систем 432 Березкин Д. В.',
    data2: '(лек) Облачные технологии 432 Пономарев А. Д.',
  },
  {
    time: '17:25 - 19:00',
    type: 1,
    data: '(лек) Методы проектирования корпоративных информационных систем 432 Березкин Д. В.',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 2,
    data: '(лек) Облачные технологии 432 Пономарев А. Д.',
    data2: '',
  },
];

const wednesday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 3,
    data: '(сем) Управление интеллектуальной собственностью 424ю Видякина О. В.',
    data2: '',
  },
  {
    time: '17:25 - 19:00',
    type: 3,
    data: '(лек) Системный анализ в управлении 424ю Миков Д. А.',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 2,
    data: '',
    data2: '(сем) Системный анализ в управлении 424ю Миков Д. А.',
  },
];

const thursday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: 'Самостоятельная работа',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '17:25 - 19:00',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 3,
    data: '',
    data2: '',
  },
];

const friday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '(сем) Методы проектирования корпоративных информационных систем 392 Гаврилова Е. Ю.',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 1,
    data: '(сем) Методы проектирования корпоративных информационных систем 392 Гаврилова Е. Ю.',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '17:25 - 19:00',
    type: 3,
    data: '(лек) Методы проектирования корпоративных информационных систем 432 Березкин Д. В.',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 3,
    data: '(лек) Облачные технологии 432 Пономарев А. Д.',
    data2: '',
  },
];

const saturday: TDayData[] = [
  {
    time: '08:30 - 10:05',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '10:15 - 11:50',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '12:00 - 13:35',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '13:50 - 15:25',
    type: 3,
    data: '',
    data2: '',
  },
  {
    time: '15:40 - 17:15',
    type: 3,
    data: '(сем) Управление интеллектуальной собственностью 424ю Видякина О. В.',
    data2: '',
  },
  {
    time: '17:25 - 19:00',
    type: 3,
    data: '(лек) Системный анализ в управлении 424ю Миков Д. А.',
    data2: '',
  },
  {
    time: '19:10 - 20:45',
    type: 2,
    data: '',
    data2: '(сем) Системный анализ в управлении 424ю Миков Д. А.',
  },
];
//#endregion

const Schedule = () => {
  const { user, toast } = useStores();
  const { login, registration, getStudentGroups, groups, loadingDropdown } =
    user;

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  const [newUser, setNewUser] = useState<TUserRegistration>(emptyNewUser);

  const getGroupNameById = (id: TUid) => {
    return groups.find((group) => group.id === id)?.name;
  };

  const getDay = (day: string, dayData: TDayData[]) => {
    return (
      <div className="flex">
        <div className={styles.day}>{day}</div>
        <div className="flex flex-column">
          <div className="flex">
            <div className={styles.headerItem}>Время</div>
            <div className={styles.headerItem}>Числитель</div>
            <div className={styles.headerItem}>Знаменатель</div>
          </div>
          <div>
            {dayData.map((item, index) => (
              <div key={index} className="flex">
                <div className={styles.time}>{item.time}</div>
                {item.type === 3 && (
                  <div
                    className={classNames(styles.type3, {
                      [styles.lastType]: index === dayData.length - 1,
                    })}
                  >
                    <EllipsisText maxLines={3}>{item.data}</EllipsisText>
                  </div>
                )}
                {item.type === 2 && (
                  <div className="flex">
                    <div className={styles.type}></div>
                    <div
                      className={classNames(styles.type2, {
                        [styles.lastType]: index === dayData.length - 1,
                      })}
                    >
                      <EllipsisText maxLines={3}>{item.data2}</EllipsisText>
                    </div>
                  </div>
                )}
                {item.type === 1 && (
                  <div className="flex">
                    <div className={styles.type}>
                      <EllipsisText maxLines={3}>{item.data}</EllipsisText>
                    </div>
                    <div
                      className={classNames(styles.type2, {
                        [styles.lastType]: index === dayData.length - 1,
                      })}
                    ></div>
                  </div>
                )}
                {item.type === 4 && (
                  <div className="flex">
                    <div className={styles.type}>
                      <EllipsisText maxLines={3}>{item.data}</EllipsisText>
                    </div>
                    <div
                      className={classNames(styles.type2, {
                        [styles.lastType]: index === dayData.length - 1,
                      })}
                    >
                      <EllipsisText maxLines={3}>{item.data2}</EllipsisText>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-column gap-2">
      <div
        className={classNames(
          styles.wr,
          'flex align-items-center justify-content-between'
        )}
      >
        <div className={styles.title}>Расписание группы ИУ6-41М</div>
        <div className="flex align-items-center justify-content-end gap-2">
          <Dropdown
            placeholder="Выберите группу"
            value={newUser.groupId}
            options={groups}
            optionLabel="name"
            optionValue="id"
            onChange={(e) =>
              setNewUser({
                ...newUser,
                groupId: e.value,
                group: getGroupNameById(e.value),
              })
            }
            loading={loadingDropdown.value}
            onShow={getStudentGroups}
            filter
          />
          <Button
            outlined
            severity="info"
            tooltipOptions={{ position: 'top' }}
            label="Импортировать"
          />
          <Button
            outlined
            severity="help"
            tooltipOptions={{ position: 'top' }}
            label="Экспортировать"
          />
        </div>
      </div>
      <div className={classNames(styles.wrapper, 'flex flex-column gap-6')}>
        <div className="flex align-items-center gap-6">
          {getDay('ПН', monday)}
          {getDay('ВТ', tuesday)}
          {getDay('СР', wednesday)}
        </div>
        <div className="flex align-items-center gap-6">
          {getDay('ЧТ', thursday)}
          {getDay('ПТ', friday)}
          {getDay('СБ', saturday)}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
