import {
  eachDayOfInterval,
  format,
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

  const isTaskInInterval = (day: Date, task: TTask) =>
    isWithinInterval(day, {
      start: parseISO(task.startDate),
      end: parseISO(task.deadline),
    });

  const getTaskDaysPerMonth = (task: TTask, months: string[], days: Date[]) => {
    const taskStart = parseISO(task.startDate);
    const taskEnd = parseISO(task.deadline);
    return months.map((monthYear) => {
      const monthDays = days.filter(
        (day) => format(day, 'yyyy-MM') === monthYear
      );
      const taskDaysInMonth = monthDays.filter((day) =>
        isWithinInterval(day, { start: taskStart, end: taskEnd })
      );
      return taskDaysInMonth.length;
    });
  };

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
              {months.map((monthYear) => {
                // Получаем дни текущего месяца
                const monthDays = days.filter(
                  (day) => format(day, 'yyyy-MM') === monthYear
                );
                // Начало и конец задачи
                const taskStart = parseISO(task.startDate);
                const taskEnd = parseISO(task.deadline);
                // Проверяем, попадает ли задача в текущий месяц
                const isTaskInMonth = monthDays.some((day) =>
                  isWithinInterval(day, { start: taskStart, end: taskEnd })
                );

                if (!isTaskInMonth) {
                  // Если задача не попадает в месяц, рендерим пустые ячейки для всего месяца
                  return monthDays.map((_, index) => (
                    <td
                      key={`${monthYear}-${index}`}
                      className={styles.td}
                    ></td>
                  ));
                } else {
                  // Иначе, определяем начальный и конечный индексы задачи в месяце
                  const startIndex = monthDays.findIndex(
                    (day) => day >= taskStart
                  );
                  const endIndex = monthDays.findIndex((day) => day > taskEnd);
                  const colspan =
                    endIndex === -1
                      ? monthDays.length - startIndex
                      : endIndex - startIndex;

                  // Рендерим пустые ячейки перед задачей, если необходимо
                  const emptyCellsBefore =
                    startIndex > 0
                      ? monthDays
                          .slice(0, startIndex)
                          .map((_, index) => (
                            <td
                              key={`${monthYear}-empty-before-${index}`}
                              className={styles.td}
                            ></td>
                          ))
                      : [];

                  // Рендерим ячейку задачи с соответствующим colSpan
                  const taskCell = (
                    <td
                      key={`${monthYear}-task-${task.id}`}
                      colSpan={colspan}
                      className={classNames(styles.td, styles.filledTd)}
                      style={colorSchema[task.status as TaskStatusEnum].content}
                    >
                      {task.title}
                    </td>
                  );

                  // Рендерим пустые ячейки после задачи, если необходимо
                  const emptyCellsAfter =
                    endIndex !== -1
                      ? monthDays
                          .slice(endIndex)
                          .map((_, index) => (
                            <td
                              key={`${monthYear}-empty-after-${index}`}
                              className={styles.td}
                            ></td>
                          ))
                      : [];

                  return [...emptyCellsBefore, taskCell, ...emptyCellsAfter];
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default observer(TimelineTasksPart);
