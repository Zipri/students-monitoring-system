import axios, { AxiosResponse } from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteTasksResponse,
  TGetListTasksByProjectResponse,
  TGetListTasksByStatusResponse,
  TGetListTasksResponse,
  TPostTasksParams,
  TPostTasksRequest,
  TPostTasksResponse,
  TPutTasksParams,
  TPutTasksRequest,
  TPutTasksResponse,
  TSearchListTasksParams,
  TSearchListTasksRequest,
  TSearchListTasksResponse,
  TTask,
} from './types';
import Qs from 'qs';

const LOCAL_URL = `${BACKEND_URL}/tasks`;

class TasksApi {
  getList = async () => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListTasksResponse>
    >(LOCAL_URL);
    return response.data;
  };

  getRecordById = async (id: TUid) => {
    const response = await axios.get<undefined, AxiosResponse<TTask>>(
      `${LOCAL_URL}/${id}`
    );
    return response.data;
  };

  postRecord = async (data: TPostTasksParams) => {
    const response = await axios.post<
      TPostTasksRequest,
      AxiosResponse<TPostTasksResponse>
    >(`${LOCAL_URL}/add`, data);
    return response.data;
  };

  putRecord = async (params: TPutTasksParams) => {
    const response = await axios.put<
      TPutTasksRequest,
      AxiosResponse<TPutTasksResponse>
    >(`${LOCAL_URL}/update/${params.id}`, params.data);
    return response.data;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<
      undefined,
      AxiosResponse<TDeleteTasksResponse>
    >(`${LOCAL_URL}/delete/${id}`);
    return response.data;
  };

  searchList = async (params: TSearchListTasksParams) => {
    const idsQuery = Qs.stringify(
      { projectsId: params.projectId },
      {
        arrayFormat: 'repeat',
      }
    );
    delete params.projectId;

    const response = await axios.get<
      TSearchListTasksRequest,
      AxiosResponse<TSearchListTasksResponse>
    >(`${LOCAL_URL}/search/?${idsQuery}`, { params });
    return response.data;
  };

  getListByProjectId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListTasksByProjectResponse>
    >(`${LOCAL_URL}/project/${id}`);
    return response.data;
  };

  getListByStatus = async (status: string) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListTasksByStatusResponse>
    >(`${LOCAL_URL}/status/${status}`);
    return response.data;
  };
}

export default TasksApi;
