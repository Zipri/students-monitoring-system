import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';
import { action, makeObservable, observable } from 'mobx';
import { TTask } from 'model/api/tasks/types';
import { TasksService } from 'model/services/tasks';

class TasksStatisticStore {
  private tasksService!: TasksService;
  private manager!: StoreManager;

  @observable
  tasks: TTask[] = [];

  tasksLoading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (tasksService: TasksService, manager: StoreManager) => {
    this.tasksService = tasksService;
    this.manager = manager;
  };

  @action
  updateTasks = (data: TTask[]) => {
    this.tasks = data;
  };
}

export default TasksStatisticStore;
