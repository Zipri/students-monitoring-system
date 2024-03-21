import { action, makeObservable, observable } from 'mobx';
import { TProject } from 'model/api/projects/types';
import { TTask } from 'model/api/tasks/types';
import { TasksService } from 'model/services/tasks';

import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

class TimelineTasksStore {
  private tasksService!: TasksService;
  private manager!: StoreManager;

  @observable
  projectTasks: TTask[] = [];

  @observable
  currentProject?: TProject;

  tasksLoading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (tasksService: TasksService, manager: StoreManager) => {
    this.tasksService = tasksService;
    this.manager = manager;
  };

  getProjectTasks = async (projectId?: TUid, currentProject?: TProject) => {
    if (!projectId) {
      this.manager.callToastError('Выберите проект');
      return;
    }
    try {
      this.tasksLoading.start();
      const response = await this.tasksService.getListByProjectId(projectId);
      this.updateProjectTasks(response);
      this.updateProject(currentProject);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getProjectTasks');
    } finally {
      this.tasksLoading.stop();
    }
  };

  reset = () => {
    this.updateProjectTasks([]);
    this.tasksLoading.stop();
    this.updateProject(undefined);
  };

  @action
  updateProject = (currentProject?: TProject) => {
    this.currentProject = currentProject;
  };

  @action
  updateProjectTasks = (data: TTask[]) => {
    this.projectTasks = data;
  };
}

export default TimelineTasksStore;
