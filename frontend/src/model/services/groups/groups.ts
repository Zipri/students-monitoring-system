import { GroupsApi } from '@api';
import { TGroupAdd } from 'model/api/groups/types';

class GroupsService {
  private baseApi!: GroupsApi;

  init = (usersApi: GroupsApi) => {
    this.baseApi = usersApi;
  };

  getListItems = async () => {
    try {
      const response = await this.baseApi.getList();
      return response;
    } catch (error) {
      throw error;
    }
  };

  addRecord = async (data: TGroupAdd) => {
    try {
      const response = await this.baseApi.postRecord(data);
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export default GroupsService;
