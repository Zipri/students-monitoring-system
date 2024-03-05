import { ProjectsApi } from '@api';
import { TProjectSearchParams } from 'model/api/projects/types';

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
}

export default ProjectsService;
