import { action, makeObservable, observable } from 'mobx';
import { TFilterListProjectsParams, TProject } from 'model/api/projects/types';
import { TTask } from 'model/api/tasks/types';
import { TUser } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';
import { TasksService } from 'model/services/tasks';

import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

class TasksKanbanStore {
  private projectsService!: ProjectsService;
  private tasksService!: TasksService;
  private manager!: StoreManager;

  @observable
  userProjects: TProject[] = [];

  @observable
  projectTasks: TTask[] = [];

  @observable
  projectFilters: TFilterListProjectsParams = {};

  @observable
  projectId?: TUid;

  projectsLoading = new Loading();
  tasksLoading = new Loading();

  userInfo!: TUser;

  constructor() {
    makeObservable(this);
  }

  init = (
    projectsService: ProjectsService,
    tasksService: TasksService,
    manager: StoreManager
  ) => {
    this.projectsService = projectsService;
    this.tasksService = tasksService;
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
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода filterProjects');
    } finally {
      this.projectsLoading.stop();
    }
  };

  getProjectTasks = async () => {
    if (!this.projectId) {
      this.manager.callToastError('Выберите проект');
      return;
    }
    try {
      this.tasksLoading.start();
      const response = await this.tasksService.getListByProjectId(
        this.projectId
      );
      this.updateProjectTasks(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getProjectTasks');
    } finally {
      this.tasksLoading.stop();
    }
  };

  reset = () => {
    console.log('reset');
    this.updateUserProjects([]);
    this.updateProjectTasks([]);
    this.updateProjectId(undefined);
    this.updateProjectFilters({});
    this.projectsLoading.stop();
    this.tasksLoading.stop();
  };

  @action
  updateUserProjects = (data: TProject[]) => {
    this.userProjects = data;
  };

  @action
  updateProjectTasks = (data: TTask[]) => {
    this.projectTasks = data;
  };

  @action
  updateProjectFilters = (data: TFilterListProjectsParams) => {
    this.projectFilters = data;
  };

  @action
  updateProjectId = (id?: TUid) => {
    this.projectId = id;
  };
}

export default TasksKanbanStore;
