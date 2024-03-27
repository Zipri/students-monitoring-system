import { TTaskModalStore } from 'control/stores/modals/task/types';
import {
  TaskStatusEnum,
  TTask,
  TTaskFilterParams,
  TTaskSortParams,
  TTaskUpdate,
} from 'model/api/tasks/types';

import { TasksApi } from '@api';
import { TUid } from '@api/types';
import { getBackendDate } from '@view/utils';
import { TTaskSortOrderEnum, TTaskSortService } from './types';

const adaptDates = (response: TTask) => ({
  startDate: new Date(response.startDate),
  deadline: new Date(response.deadline),
});

const sortServiceToString = (
  sortServices?: TTaskSortService
): string | undefined => {
  if (!sortServices) return undefined;
  return sortServices
    .map((sortService) => {
      const sortBy = sortService.sort_by ?? 'unknown'; // Значение по умолчанию или обработка неопределенного sort_by
      const sortOrder =
        sortService.sort_order === TTaskSortOrderEnum.asc ? 'asc' : 'desc';
      return `${sortBy}:${sortOrder}`;
    })
    .join(', ');
};

class TasksService {
  private baseApi!: TasksApi;

  init = (baseApi: TasksApi) => {
    this.baseApi = baseApi;
  };

  getListItems = async () => {
    try {
      const response = await this.baseApi.getList();
      return response;
    } catch (error) {
      throw error;
    }
  };

  deleteRecord = async (id: TUid) => {
    try {
      const response = await this.baseApi.deleteRecord(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getRecord = async (id: TUid) => {
    try {
      const response = await this.baseApi.getRecordById(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getTaskFormDataById = async (id: TUid): Promise<TTaskModalStore> => {
    try {
      const response = await this.getRecord(id);
      return {
        ...response,
        ...adaptDates(response),
      };
    } catch (error) {
      throw error;
    }
  };

  searchList = async (
    filters?: TTaskFilterParams,
    sorts?: TTaskSortService
  ) => {
    try {
      const response = await this.baseApi.searchList({
        ...filters,
        sort: sortServiceToString(sorts),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getListByProjectId = async (id: TUid) => {
    try {
      const response = await this.baseApi.getListByProjectId(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  changeFormRecord = async (id: TUid, data: TTaskModalStore) => {
    try {
      const response = await this.baseApi.putRecord({
        id,
        data: {
          ...data,
          startDate: getBackendDate(data.startDate),
          deadline: getBackendDate(data.deadline),
        },
      });
      return {
        ...response,
        ...adaptDates(response),
      };
    } catch (error) {
      throw error;
    }
  };

  addFormRecord = async (data: TTaskModalStore) => {
    try {
      const adaptedData = {
        ...data,
        projectId: data.projectId || '',
        title: data.title || '',
        startDate: getBackendDate(data.startDate) || '',
        deadline: getBackendDate(data.deadline) || '',
      };

      const response = await this.baseApi.postRecord(adaptedData);
      return {
        ...response,
        ...adaptDates(response),
      };
    } catch (error) {
      throw error;
    }
  };

  changeRecord = async (id: TUid, data: TTaskUpdate) => {
    try {
      const response = await this.baseApi.putRecord({
        id,

        data: {
          ...data,

          // startDate: getBackendDate(data.startDate) || '',

          // deadline: getBackendDate(data.deadline) || '',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  changeTaskStatus = async (id: TUid, status: TaskStatusEnum) => {
    try {
      const response = await this.changeRecord(id, { status });
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export default TasksService;
