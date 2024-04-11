import axios, { AxiosResponse } from 'axios';

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
  TRegistrationParams,
  TRegistrationRequest,
  TRegistrationResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/users`;

class UsersApi {
  getList = async () => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListUsersResponse>
    >(LOCAL_URL);
    return response.data;
  };

  postRecord = async (data: TPostUsersParams) => {
    const response = await axios.post<
      TPostUsersRequest,
      AxiosResponse<TPostUsersResponse>
    >(`${LOCAL_URL}/add`, data);
    return response.data;
  };

  putRecord = async (params: TPutUsersParams) => {
    const response = await axios.put<
      TPutUsersRequest,
      AxiosResponse<TPutUsersResponse>
    >(`${LOCAL_URL}/update/${params.id}`, params.data);
    return response.data;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<
      undefined,
      AxiosResponse<TDeleteUsersResponse>
    >(`${LOCAL_URL}/delete/${id}`);
    return response.data;
  };

  login = async (params: TLoginParams) => {
    const response = await axios.post<
      TLoginRequest,
      AxiosResponse<TLoginResponse>
    >(`${BACKEND_URL}/login`, params);
    return response.data;
  };

  registration = async (params: TRegistrationParams) => {
    const response = await axios.post<
      TRegistrationRequest,
      AxiosResponse<TRegistrationResponse>
    >(`${BACKEND_URL}/registration`, params);
    return response.data;
  };

  getListByGroup = async (group: string) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListUsersByGroupResponse>
    >(`${LOCAL_URL}/group/${group}`);
    return response.data;
  };

  getListByRole = async (role: string) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListUsersByRoleResponse>
    >(`${LOCAL_URL}/role/${role}`);
    return response.data;
  };
}

export default UsersApi;
