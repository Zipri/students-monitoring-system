import { observer } from 'mobx-react-lite';
import { OverlayPanel } from 'primereact/overlaypanel';
import { classNames } from 'primereact/utils';
import { FC, useRef } from 'react';
import styles from './styles.module.scss';
import { tasksKanbanColorSchema, tasksPriorityColorSchema } from '@config';
import { TTask, TaskStatusEnum } from 'model/api/tasks/types';
import { Button } from 'primereact/button';
import { useStores } from '@control';
import { EllipsisText } from '@view/common';
import { isSameDay } from 'date-fns';

const statusColorSchema = tasksKanbanColorSchema;
const priorityColorSchema = tasksPriorityColorSchema;

type TTableTimelineTableCell = {
  day: Date;
  index: number;
  taskStartIndex: number;
  taskEndIndex: number;
  taskLength: number;
  task: TTask;
};

const TableTimelineTableCell: FC<TTableTimelineTableCell> = ({
  day,
  index,
  taskLength,
  task,
  taskEndIndex,
  taskStartIndex,
}) => {
  const overlayRef = useRef<OverlayPanel>(null);
  const { timelineTasks } = useStores();
  const { changeTaskDate } = timelineTasks;

  const today = new Date();

  const handleIncDeadline = (task: TTask) => {
    changeTaskDate(task, 'deadline', true);
  };
  const handleDecDeadline = (task: TTask) => {
    changeTaskDate(task, 'deadline', false);
  };
  const handleIncStartDate = (task: TTask) => {
    changeTaskDate(task, 'startDate', true);
  };
  const handleDecStartDate = (task: TTask) => {
    changeTaskDate(task, 'startDate', false);
  };

  if (index === taskStartIndex) {
    return (
      <td
        key={index}
        colSpan={taskLength}
        className={classNames(styles.td, styles.filledTd)}
        style={statusColorSchema[task.status as TaskStatusEnum].content}
      >
        <OverlayPanel
          ref={overlayRef}
          // position="top"
          // disabled
          // mouseTrack
        >
          <div className="flex flex-column gap-1">
            <div className="flex align-items-center gap-1">
              <div>Задача:</div>
              <div>{task.title}</div>
            </div>
            <div className="flex align-items-center gap-1">
              <div>Статус:</div>
              <div>{task.status}</div>
            </div>
            <div className="flex align-items-center gap-1">
              <div>Приоритет:</div>
              <div>{task.priority}</div>
            </div>
            <div className="flex align-items-center gap-1">
              <div>Начало:</div>
              <div>{task.startDate}</div>
            </div>
            <div className="flex align-items-center gap-1">
              <div>Конец:</div>
              <div>{task.deadline}</div>
            </div>
          </div>
        </OverlayPanel>
        <div
          className={classNames(
            styles.content,
            `custom-target-icon-${task.id}`
          )}
        >
          <div className="flex flex-column align-items-center">
            <Button
              outlined
              icon="pi pi-angle-left"
              tooltip="Уменьшить на день"
              tooltipOptions={{ position: 'left' }}
              onClick={() => handleDecStartDate(task)}
              pt={{ root: { className: styles.topBtn } }}
            />
            <Button
              outlined
              icon="pi pi-angle-right"
              tooltip="Увеличить на день"
              tooltipOptions={{ position: 'left' }}
              onClick={() => handleIncStartDate(task)}
              pt={{ root: { className: styles.bottomBtn } }}
            />
          </div>
          <div className="flex align-items-center justify-content-center gap-2">
            {taskLength !== 1 ? (
              <>
                <div
                  className={styles.label}
                  onClick={(e) => overlayRef.current?.toggle(e)}
                  style={{ cursor: 'pointer' }}
                >
                  <EllipsisText hardBreak>{task.title}</EllipsisText>
                </div>

                <div
                  className={styles.label}
                  style={priorityColorSchema[task.priority].content}
                >
                  {task.priority}
                </div>
              </>
            ) : (
              <Button
                outlined
                severity="warning"
                icon="pi pi-question"
                style={{ height: '100%' }}
                onClick={(e) => overlayRef.current?.toggle(e)}
              />
            )}
          </div>
          <div className="flex flex-column align-items-center">
            <Button
              outlined
              icon="pi pi-angle-right"
              tooltip="Увеличить на день"
              tooltipOptions={{ position: 'right' }}
              onClick={() => handleIncDeadline(task)}
              pt={{ root: { className: styles.topBtn } }}
            />
            <Button
              outlined
              icon="pi pi-angle-left"
              tooltip="Уменьшить на день"
              tooltipOptions={{ position: 'right' }}
              onClick={() => handleDecDeadline(task)}
              pt={{ root: { className: styles.bottomBtn } }}
            />
          </div>
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
};

export default observer(TableTimelineTableCell);
