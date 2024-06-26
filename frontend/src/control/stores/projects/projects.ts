import { action, makeObservable, observable } from 'mobx';
import { TProject, TProjectSearchParams } from 'model/api/projects/types';
import { TUser } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';
import { UsersService } from 'model/services/users';

import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

const emptyFormData = {
  title: undefined,
  deadline: undefined,
  status: undefined,
  assignedTeacher: undefined,
};

class ProjectsStore {
  private projectsService!: ProjectsService;
  private usersService!: UsersService;
  private manager!: StoreManager;

  @observable
  projectsList: TProject[] = [];

  @observable
  initialFormData: TProjectSearchParams = emptyFormData;

  teachers: TUser[] = [];

  loading = new Loading();
  loadingDropdown = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (
    projectsService: ProjectsService,
    usersService: UsersService,
    manager: StoreManager
  ) => {
    this.projectsService = projectsService;
    this.usersService = usersService;
    this.manager = manager;
  };

  getTeachers = async () => {
    if (this.teachers.length) return this.teachers;

    try {
      this.loadingDropdown.start();
      const response = await this.usersService.getTeachers();
      this.teachers.push(...response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getTeachers');
    } finally {
      this.loadingDropdown.stop();
    }
  };

  getListData = async () => {
    try {
      this.loading.start();
      const response = await this.projectsService.getListItems();
      this.updateProjectsList(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getListData');
    } finally {
      this.loading.stop();
    }
  };

  filterListData = async (params: TProjectSearchParams) => {
    try {
      this.loading.start();
      const response = await this.projectsService.searchList(params);
      this.updateProjectsList(response);
    } catch (error) {
      this.manager.callBackendError(
        error,
        'Ошибка регистрации метода filterListData'
      );
    } finally {
      this.loading.stop();
    }
  };

  resetFilters = async () => {
    try {
      this.updateInitialFormData(emptyFormData);
      await this.filterListData(emptyFormData);
    } catch (error) {
      this.manager.callBackendError(
        error,
        'Ошибка регистрации метода resetFilters'
      );
    }
  };

  @action
  updateProjectsList = (data: TProject[]) => {
    this.projectsList = data;
  };

  @action
  updateInitialFormData = (formData: TProjectSearchParams) => {
    this.initialFormData = { ...formData };
  };
}

export default ProjectsStore;
