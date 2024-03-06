import { TProjectSearchParams } from 'model/api/projects/types';
import { UsersRolesEnum } from 'model/api/users/types';

import { ProjectsApi } from '@api';
import { TUid } from '@api/types';

class ProjectsService {
  private baseApi!: ProjectsApi;

  init = (baseApi: ProjectsApi) => {
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

  searchList = async (params: TProjectSearchParams) => {
    try {
      const response = await this.baseApi.searchList(params);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getListById = async (id: TUid, role: UsersRolesEnum) => {
    try {
      if (role === UsersRolesEnum.student) {
        const response = await this.baseApi.searchListByStudentId(id);
        return response;
      } else {
        const response = await this.baseApi.searchListByTeacherId(id);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };
}

export default ProjectsService;
