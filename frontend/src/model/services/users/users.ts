import { UsersApi } from '@api';

class UsersService {
  private baseApi!: UsersApi;

  init = (usersApi: UsersApi) => {
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

export default UsersService;
