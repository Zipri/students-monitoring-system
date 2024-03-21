import { FC } from 'react';

import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { TProject } from 'model/api/projects/types';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import { tasksKanbanColorSchema, tasksPriorityColorSchema } from '@config';
import { EllipsisText } from '@view/common';
import { useHorizontalScroll } from '@view/utils';

import styles from './styles.module.scss';

const statusColorSchema = tasksKanbanColorSchema;
const priorityColorSchema = tasksPriorityColorSchema;

type Type = {
  currentProject?: TProject;
  projectTasks: TTask[];
};

const TableTimeline: FC<Type> = ({ currentProject, projectTasks }) => {
  const today = new Date();

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
                          statusColorSchema[task.status as TaskStatusEnum]
                            .content
                        }
                      >
                        <div className={styles.content}>
                          <Button
                            outlined
                            icon="pi pi-angle-left"
                            tooltip="Уменьшить на день"
                            tooltipOptions={{ position: 'top' }}
                          />
                          <div className="flex align-items-center justify-content-center gap-2">
                            <div className={styles.label}>
                              <EllipsisText>{task.title}</EllipsisText>
                            </div>
                            <div
                              className={styles.label}
                              style={priorityColorSchema[task.priority].content}
                            >
                              {task.priority}
                            </div>
                          </div>
                          <Button
                            outlined
                            icon="pi pi-angle-right"
                            tooltip="Увеличить на день"
                            tooltipOptions={{ position: 'top' }}
                          />
                        </div>
                      </td>
                    );
                  } else if (index > taskStartIndex && index <= taskEndIndex) {
                    // Пропускаем ячейки внутри диапазона задачи
                    return null;
                  } else {
                    // Пустые ячейки за пределами задачи
                    return (
                      <td
                        key={index}
                        className={classNames(styles.td, {
                          [styles.todayTd]: isSameDay(day, today),
                        })}
                      ></td>
                    );
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

export default observer(TableTimeline);
