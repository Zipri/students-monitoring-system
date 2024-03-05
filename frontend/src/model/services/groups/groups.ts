import { GroupsApi } from '@api';

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
}

export default GroupsService;
