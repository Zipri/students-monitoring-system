import { action, makeObservable, observable } from 'mobx';
import { TFilterListProjectsParams, TProject } from 'model/api/projects/types';
import { TUser } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';

import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

class ProjectFiltersWithUrlStore {
  private projectsService!: ProjectsService;
  private manager!: StoreManager;

  @observable
  userProjects: TProject[] = [];

  @observable
  projectFilters: TFilterListProjectsParams = {};

  @observable
  projectId?: TUid;

  @observable
  project?: TProject;

  projectsLoading = new Loading();

  userInfo!: TUser;

  constructor() {
    makeObservable(this);
  }

  init = (projectsService: ProjectsService, manager: StoreManager) => {
    this.projectsService = projectsService;
    this.manager = manager;

    this.userInfo = manager.getUserInfo();
  };

  filterProjects = async () => {
    try {
      this.projectsLoading.start();
      const response = await this.projectsService.filterUserProjects(
        this.userInfo.id,
        this.userInfo.role,
        this.projectFilters
      );
      this.updateUserProjects(response);
      this.updateProject(response.find((p) => p.id === this.projectId));
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода filterProjects');
    } finally {
      this.projectsLoading.stop();
    }
  };

  reset = () => {
    this.updateUserProjects([]);
    this.updateProjectId(undefined);
    this.updateProject(undefined);
    this.updateProjectFilters({});
    this.projectsLoading.stop();
  };

  @action
  updateUserProjects = (data: TProject[]) => {
    this.userProjects = data;
  };

  @action
  updateProjectFilters = (data: TFilterListProjectsParams) => {
    this.projectFilters = data;
  };

  @action
  updateProjectId = (id?: TUid) => {
    this.projectId = id;
  };

  @action
  updateProject = (project?: TProject) => {
    this.project = project;
  };
}

export default ProjectFiltersWithUrlStore;
