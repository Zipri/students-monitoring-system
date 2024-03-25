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
import { useStores } from '@control';
import { toJS } from 'mobx';
import { Tooltip } from 'primereact/tooltip';

const statusColorSchema = tasksKanbanColorSchema;
const priorityColorSchema = tasksPriorityColorSchema;

const TableTimeline = () => {
  const { timelineTasks, projectFiltersWithUrl } = useStores();

  const { projectTasks, currentProject } = timelineTasks;
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
                          {taskLength !== 1 ? (
                            <div className="flex align-items-center justify-content-center gap-2">
                              <div className={styles.label}>
                                <EllipsisText hardBreak>
                                  {task.title}
                                </EllipsisText>
                              </div>

                              <div
                                className={styles.label}
                                style={
                                  priorityColorSchema[task.priority].content
                                }
                              >
                                {task.priority}
                              </div>
                            </div>
                          ) : (
                            <>
                              <Tooltip
                                target={`.custom-target-icon-${task.id}`}
                                position="top"
                              >
                                <div className="flex flex-column gap-1">
                                  <div className="flex align-items-center gap-1">
                                    <div>Статус:</div>
                                    <div>{task.status}</div>
                                  </div>
                                  <div className="flex align-items-center gap-1">
                                    <div>Задача:</div>
                                    <div>{task.title}</div>
                                  </div>
                                </div>
                              </Tooltip>
                              <div className={`custom-target-icon-${task.id}`}>
                                <Button
                                  outlined
                                  disabled
                                  severity="warning"
                                  icon="pi pi-question"
                                />
                              </div>
                            </>
                          )}
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
