import axios, { AxiosResponse } from 'axios';

import { TUid } from '@api/types';
import { BACKEND_URL } from '@config/app';

import {
  TDeleteCommentsResponse,
  TGetCommentsByTaskResponse,
  TGetListCommentsResponse,
  TPostCommentsParams,
  TPostCommentsRequest,
  TPostCommentsResponse,
  TPutCommentsParams,
  TPutCommentsRequest,
  TPutCommentsResponse,
} from './types';

const LOCAL_URL = `${BACKEND_URL}/comments`;

class CommentsApi {
  getList = async () => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetListCommentsResponse>
    >(LOCAL_URL);
    return response.data;
  };

  postRecord = async (data: TPostCommentsParams) => {
    const response = await axios.post<
      TPostCommentsRequest,
      AxiosResponse<TPostCommentsResponse>
    >(`${LOCAL_URL}/add`, data);
    return response.data;
  };

  putRecord = async (params: TPutCommentsParams) => {
    const response = await axios.put<
      TPutCommentsRequest,
      AxiosResponse<TPutCommentsResponse>
    >(`${LOCAL_URL}/update/${params.id}`, params.data);
    return response.data;
  };

  deleteRecord = async (id: TUid) => {
    const response = await axios.delete<
      undefined,
      AxiosResponse<TDeleteCommentsResponse>
    >(`${LOCAL_URL}/delete/${id}`);
    return response.data;
  };

  getListByTaskId = async (id: TUid) => {
    const response = await axios.get<
      undefined,
      AxiosResponse<TGetCommentsByTaskResponse>
    >(`${LOCAL_URL}/task/${id}`);
    return response.data;
  };
}

export default CommentsApi;
