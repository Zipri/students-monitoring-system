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
      currentProject && this.updateProject(currentProject);
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

  // TODO добавить обработку конца месяца
  private incDate = (date: string) => {
    const splited = date.split('-');
    const stringDay = (+splited[2] + 1).toString();
    const day = stringDay.length === 1 ? `0${stringDay}` : stringDay;
    return `${splited[0]}-${splited[1]}-${day}`;
  };

  // TODO добавить обработку конца месяца
  private decDate = (date: string) => {
    const splited = date.split('-');
    const stringDay = (+splited[2] - 1).toString();
    const day = stringDay.length === 1 ? `0${stringDay}` : stringDay;
    return `${splited[0]}-${splited[1]}-${day}`;
  };

  changeTaskDate = async (task: TTask, dateField: string, isInc: boolean) => {
    try {
      this.tasksLoading.start();

      //@ts-expect-error
      const taskField = task[dateField];

      const newDate = isInc ? this.incDate(taskField) : this.decDate(taskField);

      const updated = {
        ...task,
        [dateField]: newDate,
      };

      const response = await this.tasksService.changeRecord(task.id, updated);

      const newTasks = this.projectTasks.map((i) => {
        if (i.id !== task.id) return i;
        return response;
      });

      this.updateProjectTasks(newTasks);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getProjectTasks');
    } finally {
      this.tasksLoading.stop();
    }
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
