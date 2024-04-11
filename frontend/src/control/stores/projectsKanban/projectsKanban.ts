import { action, makeObservable, observable } from 'mobx';
import { ProjectsStatusesEnum, TProject } from 'model/api/projects/types';
import { ProjectsService } from 'model/services/projects';

import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';
import { TUser } from 'model/api/users/types';
import { TUid } from '@api/types';

class ProjectsKanbanStore {
  private projectsService!: ProjectsService;
  private manager!: StoreManager;

  @observable
  userProjects: TProject[] = [];

  loading = new Loading();

  userInfo!: TUser;

  constructor() {
    makeObservable(this);
  }

  init = (projectsService: ProjectsService, manager: StoreManager) => {
    this.projectsService = projectsService;
    this.manager = manager;

    this.userInfo = manager.getUserInfo();
  };

  getUserProjects = async () => {
    try {
      this.loading.start();
      const response = await this.projectsService.getListById(
        this.userInfo.id,
        this.userInfo.role
      );
      this.updateUserProjects(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getUserProjects');
    } finally {
      this.loading.stop();
    }
  };

  changeStatus = async (id: TUid, status: ProjectsStatusesEnum) => {
    try {
      this.loading.start();
      const response = await this.projectsService.changeProjectStatus(
        id,
        status
      );
      const newUserProjects = this.userProjects.map((item) => {
        if (item.id !== id) return item;
        return {
          ...response,
        };
      });
      this.updateUserProjects(newUserProjects);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода changeStatus');
    } finally {
      this.loading.stop();
    }
  };

  deleteProject = async (id: TUid) => {
    try {
      this.loading.start();
      await this.projectsService.deleteRecord(id);
      await this.getUserProjects();
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода deleteProject');
    } finally {
      this.loading.stop();
    }
  };

  reset = () => {
    this.updateUserProjects([]);
    this.loading.stop();
  };

  @action
  updateUserProjects = (data: TProject[]) => {
    this.userProjects = data;
  };
}

export default ProjectsKanbanStore;
