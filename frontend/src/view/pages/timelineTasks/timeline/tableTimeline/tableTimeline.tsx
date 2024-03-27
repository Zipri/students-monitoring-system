import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { classNames } from 'primereact/utils';

import { useStores } from '@control';
import { useHorizontalScroll } from '@view/utils';

import styles from './styles.module.scss';
import TableTimelineTableCell from './tableCell';

const TableTimeline = () => {
  const { timelineTasks, projectFiltersWithUrl } = useStores();

  const { projectTasks, currentProject, changeTaskDate } = timelineTasks;
  const { notUserProject } = projectFiltersWithUrl;

  const timelineTaskItems = (toJS(projectTasks) || []).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const today = new Date();

  const days = eachDayOfInterval({
    start: parseISO((currentProject || notUserProject)?.startDate || ''),
    end: parseISO((currentProject || notUserProject)?.deadline || ''),
  });

  const months = days.reduce<string[]>((acc, day) => {
    const monthYear = format(day, 'yyyy-MM');
    if (acc.indexOf(monthYear) === -1) {
      acc.push(monthYear);
    }
    return acc;
  }, []);

  useHorizontalScroll('timeline-tasks-part');

  return (
    <div id="timeline-tasks-part" className={styles.tableWrapper}>
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
                className={classNames(styles.th, {
                  [styles.today]: isSameDay(day, today),
                })}
                style={{ minWidth: '10rem' }}
              >
                <div className="flex align-items-center justify-content-center gap-2">
                  {isSameDay(day, today) && <div>Сегодня</div>}
                  {format(day, 'dd')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {timelineTaskItems.map((task) => {
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
                {days.map((day, index) => (
                  <TableTimelineTableCell
                    key={`${day}-${index}`}
                    day={day}
                    index={index}
                    taskStartIndex={taskStartIndex}
                    taskEndIndex={taskEndIndex}
                    taskLength={taskLength}
                    task={task}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default observer(TableTimeline);
