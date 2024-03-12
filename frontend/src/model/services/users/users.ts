import {
  TUserRegistration,
  TUserUpdate,
  UsersRolesEnum,
} from 'model/api/users/types';

import { UsersApi } from '@api';
import { TUid } from '@api/types';

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

  getRecord = async (id: TUid) => {
    try {
      // const response = await this.baseApi.ge({ id, data });
      // return response;
    } catch (error) {
      throw error;
    }
  };

  updateRecord = async (id: TUid, data: TUserUpdate) => {
    try {
      const response = await this.baseApi.putRecord({ id, data });
      return response;
    } catch (error) {
      throw error;
    }
  };

  getTeachers = async () => {
    try {
      const response = await this.baseApi.getListByRole(UsersRolesEnum.teacher);
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

  registrationUser = async (data: TUserRegistration) => {
    try {
      const response = await this.baseApi.registration(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getTeachersShort = async () => {
    try {
      const response = await this.baseApi.getListByRole(UsersRolesEnum.teacher);
      return response.map((item) => ({
        id: item.id,
        name: item.username,
      }));
    } catch (error) {
      throw error;
    }
  };

  getStudentsShort = async () => {
    try {
      const response = await this.baseApi.getListByRole(UsersRolesEnum.student);
      return response.map((item) => ({
        id: item.id,
        name: item.username,
      }));
    } catch (error) {
      throw error;
    }
  };
}

export default UsersService;
