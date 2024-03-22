import { TaskPriorityEnum, TaskStatusEnum } from 'model/api/tasks/types';

import { TDate, TUid } from '@api/types';

export type TTaskModalStore = {
  /** Пустое для инициализации, но не может быть пустым при добавлении или редактировании */
  projectId?: TUid;
  title?: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  startDate?: TDate;
  deadline?: TDate;
};
