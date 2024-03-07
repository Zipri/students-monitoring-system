import {
  TDate,
  TResponseDeletedCount,
  TResponseModifiedCount,
  TResponseResult,
  TUid,
} from '@api/types';

export enum TaskStatusEnum {
  new = 'Новая',
  working = 'В работе',
  done = 'Завершена',
}

export enum TaskPriorityEnum {
  low = 'Низкий',
  medium = 'Средний',
  high = 'Высокий',
}

export type TTask = {
  id: TUid;
  projectId: TUid;
  title: string;
  description?: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  deadline: TDate;
};

export type TTaskAdd = Omit<TTask, 'id'>;

export type TTaskUpdate = Partial<TTaskAdd>;

export type TTaskFilterParams = Partial<{
  projectId: TUid;
  title: string;
  description: string;
  status: TaskStatusEnum;
  priority: TaskPriorityEnum;
  deadline: TDate;
}>;

// Get list: Для получения списка задач
export type TGetListTasksResponse = TTask[];

// Post record: Для добавления новой задачи
export type TPostTasksParams = TTaskAdd;
export type TPostTasksRequest = TTaskAdd;
export type TPostTasksResponse = TTask;

// Put record: Для обновления задачи
export type TPutTasksParams = { id: TUid; data: TTaskUpdate };
export type TPutTasksRequest = TTaskUpdate;
export type TPutTasksResponse = TTask;

// Delete record: Для удаления задачи
export type TDeleteTasksResponse = TResponseDeletedCount;

// Get list by projectId: Для получения задач по идентификатору проекта
export type TGetListTasksByProjectResponse = TTask[];

// Get list by status: Для получения задач по статусу
export type TGetListTasksByStatusResponse = TTask[];

// Filter list: Для фильтрации задач
export type TFilterListTasksParams = TTaskFilterParams;
export type TFilterListTasksRequest = TTaskFilterParams;
export type TFilterListTasksResponse = TTask[];
