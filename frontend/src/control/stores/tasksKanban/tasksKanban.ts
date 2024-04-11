import { action, makeObservable, observable } from 'mobx';
import { TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { TasksService } from 'model/services/tasks';

import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

class TasksKanbanStore {
  private tasksService!: TasksService;
  private manager!: StoreManager;

  @observable
  projectTasks: TTask[] = [];

  tasksLoading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (tasksService: TasksService, manager: StoreManager) => {
    this.tasksService = tasksService;
    this.manager = manager;
  };

  getProjectTasks = async (projectId?: TUid) => {
    if (!projectId) {
      this.manager.callToastError('Выберите проект');
      return;
    }
    try {
      this.tasksLoading.start();
      const response = await this.tasksService.getListByProjectId(projectId);
      this.updateProjectTasks(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getProjectTasks');
    } finally {
      this.tasksLoading.stop();
    }
  };

  changeStatus = async (id: TUid, status: TaskStatusEnum) => {
    try {
      this.tasksLoading.start();
      const response = await this.tasksService.changeTaskStatus(id, status);
      const newProjectTasks = this.projectTasks.map((item) => {
        if (item.id !== id) return item;
        return {
          ...response,
        };
      });
      this.updateProjectTasks(newProjectTasks);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода changeStatus');
    } finally {
      this.tasksLoading.stop();
    }
  };

  reset = () => {
    this.updateProjectTasks([]);
    this.tasksLoading.stop();
  };

  @action
  updateProjectTasks = (data: TTask[]) => {
    this.projectTasks = data;
  };
}

export default TasksKanbanStore;
