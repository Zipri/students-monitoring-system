import axios, { AxiosResponse } from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteProjectsResponse,
  TFilterListProjectsParams,
  TFilterListProjectsRequest,
  TFilterListProjectsResponse,
  TGetListByGroupProjectsResponse,
  TGetListByStudentsProjectsResponse,
  TGetListByTeacherProjectsResponse,
  TGetListProjectsResponse,
  TGetProjectsResponse,
  TPostProjectsParams,
  TPostProjectsRequest,
  TPostProjectsResponse,
  TPutProjectsParams,
  TPutProjectsRequest,
  TPutProjectsResponse,
  TSearchListProjectsParams,
  TSearchListProjectsRequest,
  TSearchListProjectsResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/projects`;

class ProjectsApi {
  getList = async () => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListProjectsResponse>
    >(LOCAL_URL);
    return response.data;
  };

  postRecord = async (data: TPostProjectsParams) => {
    const response = await axios.post<
      TPostProjectsRequest,
      AxiosResponse<TPostProjectsResponse>
    >(`${LOCAL_URL}/add`, data);
    return response.data;
  };

  putRecord = async (params: TPutProjectsParams) => {
    const response = await axios.put<
      TPutProjectsRequest,
      AxiosResponse<TPutProjectsResponse>
    >(`${LOCAL_URL}/update/${params.id}`, params.data);
    return response.data;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<
      undefined,
      AxiosResponse<TDeleteProjectsResponse>
    >(`${LOCAL_URL}/delete/${id}`);
    return response.data;
  };

  getRecord = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetProjectsResponse>
    >(`${LOCAL_URL}/${id}`);
    return response.data;
  };

  searchList = async (params: TSearchListProjectsParams) => {
    const response = await axios.get<
      TSearchListProjectsRequest,
      AxiosResponse<TSearchListProjectsResponse>
    >(`${LOCAL_URL}/search`, { params });
    return response.data;
  };

  filterList = async (params: TFilterListProjectsParams) => {
    const response = await axios.get<
      TFilterListProjectsRequest,
      AxiosResponse<TFilterListProjectsResponse>
    >(`${LOCAL_URL}/filter`, { params });
    return response.data;
  };

  searchListByTeacherId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListByTeacherProjectsResponse>
    >(`${LOCAL_URL}/teacher/${id}`);
    return response.data;
  };

  searchListByStudentId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListByStudentsProjectsResponse>
    >(`${LOCAL_URL}/student/${id}`);
    return response.data;
  };

  searchListByGroupId = async (group: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListByGroupProjectsResponse>
    >(`${LOCAL_URL}/group/${group}`);
    return response.data;
  };
}

export default ProjectsApi;
