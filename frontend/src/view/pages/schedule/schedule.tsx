import styles from './styles.module.scss';

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

const Schedule = () => {
  return <div className={styles.wrapper}>ебись оно конем</div>;
};

export default Schedule;
