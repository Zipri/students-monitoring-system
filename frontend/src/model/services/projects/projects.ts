import { TProjectsKanbanModalStore } from 'control/stores/modals/projectsKanban/types';
import {
  ProjectsStatusesEnum,
  TFilterListProjectsParams,
  TProjectAdd,
  TProjectSearchParams,
  TProjectUpdate,
} from 'model/api/projects/types';
import { UsersRolesEnum } from 'model/api/users/types';

import { ProjectsApi } from '@api';
import { TUid } from '@api/types';
import { adaptBackendDate, getBackendDate } from '@view/utils';

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

  getProjectsByGroup = async (groupId: TUid) => {
    try {
      const response = await this.baseApi.searchListByGroupId(groupId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  filterUserProjects = async (
    id: TUid,
    role: UsersRolesEnum,
    params: TFilterListProjectsParams
  ) => {
    try {
      if (role === UsersRolesEnum.student) {
        const response = await this.baseApi.filterList({
          ...params,
          assignedStudents: [id],
        });
        return response;
      } else {
        const response = await this.baseApi.filterList({
          ...params,
          assignedTeacher: id,
        });
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  // TODO переименовать
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

  getRecordById = async (id: TUid) => {
    try {
      const response = await this.baseApi.getRecord(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getFormDataById = async (id: TUid) => {
    try {
      const response = await this.baseApi.getRecord(id);
      return {
        ...response,
        assignedTeacher: response.assignedTeacher.id,
        assignedStudents: response.assignedStudents?.map((i) => i.id),
        deadline: adaptBackendDate(response.deadline),
        startDate: adaptBackendDate(response.startDate),
      };
    } catch (error) {
      throw error;
    }
  };

  addRecord = async (data: TProjectAdd) => {
    try {
      const response = await this.baseApi.postRecord({
        ...data,
        //@ts-expect-error не соответствие типов с UI
        deadline: getBackendDate(data.deadline) || '',
        status: ProjectsStatusesEnum.planning,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  addFormRecord = async (data: TProjectsKanbanModalStore) => {
    try {
      const adaptedData = {
        ...data,
        title: data.title || '',
        assignedTeacher: data.assignedTeacher || '',
        startDate: getBackendDate(data.startDate) || '',
        deadline: getBackendDate(data.deadline) || '',
      };

      await this.baseApi.postRecord(adaptedData);
    } catch (error) {
      throw error;
    }
  };

  changeFormRecord = async (id: TUid, data: TProjectsKanbanModalStore) => {
    try {
      await this.baseApi.putRecord({
        id,
        data: {
          ...data,
          startDate: getBackendDate(data.startDate),
          deadline: getBackendDate(data.deadline),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  changeRecord = async (id: TUid, data: TProjectUpdate) => {
    try {
      const response = await this.baseApi.putRecord({
        id,
        //@ts-expect-error не соответствие типов с UI
        data: { ...data, deadline: getBackendDate(data.deadline) },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  changeProjectStatus = async (id: TUid, status: ProjectsStatusesEnum) => {
    try {
      const response = await this.changeRecord(id, { status });
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
}

export default ProjectsService;
