import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';
import { action, makeObservable, observable } from 'mobx';
import {
  TTask,
  TTaskFilterParams,
  TTaskSortParams,
} from 'model/api/tasks/types';
import { TUser, UsersRolesEnum } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';
import { TasksService } from 'model/services/tasks';
import { TTaskSortService } from 'model/services/tasks/types';

class TasksStatisticStore {
  private tasksService!: TasksService;
  private projectsService!: ProjectsService;
  private manager!: StoreManager;

  @observable
  tasks: TTask[] = [];

  @observable
  filters: TTaskFilterParams = {};

  @observable
  sorters: TTaskSortService = [];

  @observable
  projectsIds: TUid[] = [];

  userInfo!: TUser;

  loading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (
    tasksService: TasksService,
    projectsService: ProjectsService,
    manager: StoreManager
  ) => {
    this.tasksService = tasksService;
    this.projectsService = projectsService;
    this.manager = manager;

    this.userInfo = this.manager.getUserInfo();
  };

  getProjectsIds = async () => {
    try {
      this.loading.start();

      const response = await this.projectsService.getListById(
        this.userInfo.id,
        this.userInfo.role
      );

      this.updateProjectsIds(response.map((project) => project.id));
      await this.searchTasks();
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getProjectsIds');
    } finally {
      this.loading.stop();
    }
  };

  searchTasks = async () => {
    if (this.projectsIds.length === 0) {
      this.manager.callToastError(
        'Для отображения должны существовать проекты'
      );
      return;
    }
    try {
      this.loading.start();

      const response = await this.tasksService.searchList(
        { ...this.filters, projectId: this.projectsIds },
        this.sorters
      );

      this.updateTasks(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода searchTasks');
    } finally {
      this.loading.stop();
    }
  };

  reset = () => {
    this.updateTasks([]);
    this.updateFilters({});
    this.updateSorters([]);
    this.updateProjectsIds([]);

    this.loading.stop();
  };

  @action
  updateTasks = (data: TTask[]) => {
    this.tasks = data;
  };

  @action
  updateFilters = (data: TTaskFilterParams) => {
    this.filters = data;
  };

  @action
  updateSorters = (data: TTaskSortService) => {
    this.sorters = data;
  };

  @action
  updateProjectsIds = (data: TUid[]) => {
    this.projectsIds = data;
  };
}

export default TasksStatisticStore;
