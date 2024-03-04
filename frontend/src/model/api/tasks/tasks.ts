import axios from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteTasksResponse,
  TGetListTasksResponse,
  TPostTasksParams,
  TPostTasksRequest,
  TPostTasksResponse,
  TPutTasksParams,
  TPutTasksRequest,
  TPutTasksResponse,
  TFilterListTasksParams,
  TFilterListTasksRequest,
  TFilterListTasksResponse,
  TGetListTasksByProjectResponse,
  TGetListTasksByStatusResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/tasks`;

class TasksApi {
  getList = async () => {
    const response = await axios.get<undefined, TGetListTasksResponse>(
      LOCAL_URL
    );
    return response;
  };

  postRecord = async (data: TPostTasksParams) => {
    const response = await axios.post<TPostTasksRequest, TPostTasksResponse>(
      `${LOCAL_URL}/add`,
      data
    );
    return response;
  };

  putRecord = async (params: TPutTasksParams) => {
    const response = await axios.put<TPutTasksRequest, TPutTasksResponse>(
      `${LOCAL_URL}/update/${params.id}`,
      params.data
    );
    return response;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<undefined, TDeleteTasksResponse>(
      `${LOCAL_URL}/update/${id}`
    );
    return response;
  };

  filterList = async (params: TFilterListTasksParams) => {
    const response = await axios.get<
      TFilterListTasksRequest,
      TFilterListTasksResponse
    >(`${LOCAL_URL}/filter`, { params });
    return response;
  };

  getListByProjectId = async (id: TUid) => {
    const response = await axios.get<undefined, TGetListTasksByProjectResponse>(
      `${LOCAL_URL}/project/${id}`
    );
    return response;
  };

  getListByStatus = async (status: string) => {
    const response = await axios.get<undefined, TGetListTasksByStatusResponse>(
      `${LOCAL_URL}/status/${status}`
    );
    return response;
  };
}

export default TasksApi;
