import { action, makeObservable, observable, toJS } from 'mobx';
import { TGroup, TGroupStudents } from 'model/api/groups/types';
import { TUser } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';
import { TasksService } from 'model/services/tasks';
import { UsersService } from 'model/services/users';

import { TUid } from '@api/types';
import { AutocompleteControllerStore, Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

import { ProjectStatistic } from './types';
import { GroupsService } from 'model/services/groups';

class ProjectsStatisticStore {
  private tasksService!: TasksService;
  private projectsService!: ProjectsService;
  private usersService!: UsersService;
  private manager!: StoreManager;

  @observable
  group?: TGroup;

  @observable
  students: TGroupStudents[] = [];

  @observable
  statisticProjects: ProjectStatistic[] = [];

  userInfo!: TUser;

  loading = new Loading();

  groupsAutocomplete!: AutocompleteControllerStore;

  constructor() {
    makeObservable(this);
  }

  init = (
    tasksService: TasksService,
    projectsService: ProjectsService,
    usersService: UsersService,
    groupsService: GroupsService,
    manager: StoreManager
  ) => {
    this.tasksService = tasksService;
    this.projectsService = projectsService;
    this.usersService = usersService;
    this.manager = manager;

    this.userInfo = this.manager.getUserInfo();

    this.groupsAutocomplete = new AutocompleteControllerStore(
      groupsService.getListItems
    );
  };

  getProjectsByGroup = async () => {
    if (!this.group) {
      // this.manager.callToastError('Выберите группу');
      return;
    }
    try {
      this.loading.start();

      const response = await this.projectsService.getProjectsByGroup(
        this.group.id
      );

      this.updateStatisticProjects(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getStudentsByGroup');
    } finally {
      this.loading.stop();
    }
  };

  setGroup = (group: TGroup) => {
    this.updateGroup(group);
    this.updateStudents(group.students);
  };

  reset = () => {
    this.updateStatisticProjects([]);
    this.updateGroup(undefined);
    this.updateStudents([]);

    this.loading.stop();
  };

  @action
  updateGroup = (data?: TGroup) => {
    this.group = data;
  };

  @action
  updateStudents = (data: TGroupStudents[]) => {
    this.students = data;
  };

  @action
  updateStatisticProjects = (data: ProjectStatistic[]) => {
    this.statisticProjects = data;
  };
}

export default ProjectsStatisticStore;
