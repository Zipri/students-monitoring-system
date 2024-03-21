import {
  TaskStatusEnum,
  TTaskFilterParams,
  TTaskUpdate,
} from 'model/api/tasks/types';

import { TasksApi } from '@api';
import { TUid } from '@api/types';
import { getBackendDate } from '@view/utils';

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

  filterList = async (params: TTaskFilterParams) => {
    try {
      const response = await this.baseApi.filterList(params);
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

  changeRecord = async (id: TUid, data: TTaskUpdate) => {
    try {
      const response = await this.baseApi.putRecord({
        id,
        //@ts-expect-error не соответствие типов с UI
        data: { ...data, deadline: getBackendDate(data.deadline) },
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
