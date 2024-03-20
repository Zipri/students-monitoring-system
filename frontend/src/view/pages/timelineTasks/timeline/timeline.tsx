import {
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { observer } from 'mobx-react-lite';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { classNames } from 'primereact/utils';

import { tasksKanbanColorSchema } from '@config';
import { useStores } from '@control';
import { getBackendDate, useHorizontalScroll } from '@view/utils';

import styles from './styles.module.scss';

const colorSchema = tasksKanbanColorSchema;

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
          {projectTasks.map((task) => {
            const taskStart = parseISO(task.startDate);
            const taskEnd = parseISO(task.deadline);
            const taskStartIndex = days.findIndex((day) =>
              isSameDay(day, taskStart)
            );
            const taskEndIndex = days.findIndex((day) =>
              isSameDay(day, taskEnd)
            );
            const taskLength = taskEndIndex - taskStartIndex + 1;

            return (
              <tr key={task.id}>
                {days.map((day, index) => {
                  if (index === taskStartIndex) {
                    return (
                      <td
                        key={index}
                        colSpan={taskLength}
                        className={classNames(styles.td, styles.filledTd)}
                        style={
                          colorSchema[task.status as TaskStatusEnum].content
                        }
                      >
                        {task.title}
                      </td>
                    );
                  } else if (index > taskStartIndex && index <= taskEndIndex) {
                    // Пропускаем ячейки внутри диапазона задачи
                    return null;
                  } else {
                    // Пустые ячейки за пределами задачи
                    return <td key={index} className={styles.td}></td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default observer(TimelineTasksPart);
