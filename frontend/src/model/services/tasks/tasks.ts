import { TasksApi } from '@api';
import { TUid } from '@api/types';
import { TTaskFilterParams } from 'model/api/tasks/types';

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
}

export default TasksService;
