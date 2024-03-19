import { observer } from 'mobx-react-lite';

import {
  eachDayOfInterval,
  format,
  isWithinInterval,
  parseISO,
} from 'date-fns';

import { useStores } from '@control';

import styles from './styles.module.scss';
import { useHorizontalScroll } from '@view/utils';

const TimelineTasksPart = () => {
  const { timelineTasks, manager } = useStores();
  const { projectTasks, currentProject } = timelineTasks;

  const days = eachDayOfInterval({
    start: parseISO(currentProject?.startDate || ''),
    end: parseISO(currentProject?.deadline || ''),
  });
  const months = days.reduce<string[]>((acc, day) => {
    const monthYear = format(day, 'yyyy-MM');
    if (acc.indexOf(monthYear) === -1) {
      acc.push(monthYear);
    }
    return acc;
  }, []);

  useHorizontalScroll('timeline-tasks-part');

  if (!currentProject) return <div id="timeline-tasks-part"></div>;
  return (
    <div className={styles.wrapper} id="timeline-tasks-part">
      <table className={styles.table}>
        <thead>
          <tr>
            {months.map((monthYear) => {
              const monthDays = days.filter(
                (day) => format(day, 'yyyy-MM') === monthYear
              );
              return (
                <th
                  key={monthYear}
                  colSpan={monthDays.length}
                  className={styles.th}
                >
                  {format(parseISO(`${monthYear}-01`), 'MMMM yyyy')}
                </th>
              );
            })}
          </tr>
          <tr>
            {days.map((day) => (
              <th
                key={day.toString()}
                className={styles.th}
                style={{ minWidth: '10rem' }}
              >
                {format(day, 'dd')}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {projectTasks.map((task) => (
            <tr key={task.id}>
              {days.map((day) => (
                <td
                  key={day.toString()}
                  style={{
                    border: '1px solid #ddd',
                    padding: '5px',
                    backgroundColor: isWithinInterval(day, {
                      start: parseISO(task.startDate),
                      end: parseISO(task.deadline),
                    })
                      ? 'lightblue'
                      : 'transparent',
                  }}
                >
                  {isWithinInterval(day, {
                    start: parseISO(task.startDate),
                    end: parseISO(task.deadline),
                  }) && task.title}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default observer(TimelineTasksPart);
