import { UsersApi } from '@api';
import { TUserAdd } from 'model/api/users/types';

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

  loginUser = async (email: string, password: string) => {
    try {
      const response = await this.baseApi.login({ email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  registrationUser = async (data: TUserAdd) => {
    try {
      const response = await this.baseApi.postRecord(data);
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export default UsersService;
