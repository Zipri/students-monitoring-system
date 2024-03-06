import { action, makeObservable, observable } from 'mobx';
import { TProject } from 'model/api/projects/types';
import { ProjectsService } from 'model/services/projects';

import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';
import { TUser } from 'model/api/users/types';

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

  @action
  updateUserProjects = (data: TProject[]) => {
    this.userProjects = data;
  };
}

export default ProjectsKanbanStore;
