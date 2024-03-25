import { TCommentAdd, TCommentUpdate } from 'model/api/comments/types';

import { CommentsApi } from '@api';
import { TUid } from '@api/types';

class CommentsService {
  private baseApi!: CommentsApi;

  init = (baseApi: CommentsApi) => {
    this.baseApi = baseApi;
  };

  getListItems = async () => {
    try {
      const response = await this.baseApi.getList();
      return response;
    } catch (error) {
      throw error;
    }
  };

  addRecord = async (data: TCommentAdd) => {
    try {
      const response = await this.baseApi.postRecord(data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  changeRecord = async (id: TUid, data: TCommentUpdate) => {
    try {
      const response = await this.baseApi.putRecord({ id, data });
      return response;
    } catch (error) {
      throw error;
    }
  };

  deleteRecord = async (id: TUid) => {
    try {
      const response = await this.baseApi.deleteRecord(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getCommentsByTaskId = async (id: TUid) => {
    try {
      const response = await this.baseApi.getListByTaskId(id);
      return response;
    } catch (error) {
      throw error;
    }
  };
}

export default CommentsService;
