import axios from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteUsersResponse,
  TGetListUsersByGroupResponse,
  TGetListUsersByRoleResponse,
  TGetListUsersResponse,
  TLoginParams,
  TLoginRequest,
  TLoginResponse,
  TPostUsersParams,
  TPostUsersRequest,
  TPostUsersResponse,
  TPutUsersParams,
  TPutUsersRequest,
  TPutUsersResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/users`;

class UsersApi {
  getList = async () => {
    const response = await axios.get<undefined, TGetListUsersResponse>(
      LOCAL_URL
    );
    return response;
  };

  postRecord = async (data: TPostUsersParams) => {
    const response = await axios.post<TPostUsersRequest, TPostUsersResponse>(
      `${LOCAL_URL}/add`,
      data
    );
    return response;
  };

  putRecord = async (params: TPutUsersParams) => {
    const response = await axios.put<TPutUsersRequest, TPutUsersResponse>(
      `${LOCAL_URL}/update/${params.id}`,
      params.data
    );
    return response;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<undefined, TDeleteUsersResponse>(
      `${LOCAL_URL}/update/${id}`
    );
    return response;
  };

  login = async (params: TLoginParams) => {
    const response = await axios.post<TLoginRequest, TLoginResponse>(
      `${BACKEND_URL}/login`,
      params
    );
    return response;
  };

  getListByGroup = async (group: string) => {
    const response = await axios.get<undefined, TGetListUsersByGroupResponse>(
      `${LOCAL_URL}/group/${group}`
    );
    return response;
  };

  getListByRole = async (role: string) => {
    const response = await axios.get<undefined, TGetListUsersByRoleResponse>(
      `${LOCAL_URL}/role/${role}`
    );
    return response;
  };
}

export default UsersApi;
