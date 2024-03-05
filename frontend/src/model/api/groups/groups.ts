import axios, { AxiosResponse } from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteGroupsResponse,
  TGetGroupsByStudentResponse,
  TGetListGroupsResponse,
  TPostGroupsParams,
  TPostGroupsRequest,
  TPostGroupsResponse,
  TPutGroupsParams,
  TPutGroupsRequest,
  TPutGroupsResponse,
  TSearchGroupsResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/groups`;

class GroupsApi {
  getList = async () => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListGroupsResponse>
    >(LOCAL_URL);
    return response.data;
  };

  postRecord = async (data: TPostGroupsParams) => {
    const response = await axios.post<
      TPostGroupsRequest,
      AxiosResponse<TPostGroupsResponse>
    >(`${LOCAL_URL}/add`, data);
    return response.data;
  };

  putRecord = async (params: TPutGroupsParams) => {
    const response = await axios.put<
      TPutGroupsRequest,
      AxiosResponse<TPutGroupsResponse>
    >(`${LOCAL_URL}/${params.id}`, params.data);
    return response.data;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<
      undefined,
      AxiosResponse<TDeleteGroupsResponse>
    >(`${LOCAL_URL}/${id}`);
    return response.data;
  };
  getListByName = async (group: string) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TSearchGroupsResponse>
    >(`${LOCAL_URL}/search/${group}`);
    return response.data;
  };

  getListByStudent = async (student: string) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetGroupsByStudentResponse>
    >(`${LOCAL_URL}/student/${student}`);
    return response.data;
  };
}

export default GroupsApi;
