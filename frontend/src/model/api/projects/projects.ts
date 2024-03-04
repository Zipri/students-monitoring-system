import axios from 'axios';

import { BACKEND_URL } from '../../../config';
import { TUid } from '../types';
import {
  TDeleteProjectsResponse,
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
    const response = await axios.get<undefined, TGetListProjectsResponse>(
      LOCAL_URL
    );
    return response;
  };

  postRecord = async (data: TPostProjectsParams) => {
    const response = await axios.post<
      TPostProjectsRequest,
      TPostProjectsResponse
    >(`${LOCAL_URL}/add`, data);
    return response;
  };

  putRecord = async (params: TPutProjectsParams) => {
    const response = await axios.put<TPutProjectsRequest, TPutProjectsResponse>(
      `${LOCAL_URL}/update/${params.id}`,
      params.data
    );
    return response;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<undefined, TDeleteProjectsResponse>(
      `${LOCAL_URL}/update/${id}`
    );
    return response;
  };

  getRecord = async (id: TUid) => {
    const response = await axios.get<undefined, TGetProjectsResponse>(
      `${LOCAL_URL}/${id}`
    );
    return response;
  };

  searchList = async (params: TSearchListProjectsParams) => {
    const response = await axios.get<
      TSearchListProjectsRequest,
      TSearchListProjectsResponse
    >(`${LOCAL_URL}/search`, { params });
    return response;
  };

  searchListByTeacherId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      TGetListByTeacherProjectsResponse
    >(`${LOCAL_URL}/teacher/${id}`);
    return response;
  };

  searchListByStudentId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      TGetListByStudentsProjectsResponse
    >(`${LOCAL_URL}/student/${id}`);
    return response;
  };

  searchListByGroupId = async (group: string) => {
    const response = await axios.get<
      undefined,
      TGetListByGroupProjectsResponse
    >(`${LOCAL_URL}/group/${group}`);
    return response;
  };
}

export default ProjectsApi;
