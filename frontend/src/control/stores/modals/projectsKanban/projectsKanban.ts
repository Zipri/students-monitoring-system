import { action, makeObservable, observable } from 'mobx';
import { TProject, TProjectAdd } from 'model/api/projects/types';
import { ProjectsService } from 'model/services/projects';
import { UsersService } from 'model/services/users';

import { TUid } from '@api/types';
import { AutocompleteControllerStore, Loading, Toggle } from '@stores/common';
import { StoreManager } from '@stores/manager';

import { TProjectsKanbanModalStore } from './types';

const emptyFormData: TProjectsKanbanModalStore = {
  title: undefined,
  description: undefined,
  deadline: undefined,
  status: undefined,
  assignedStudents: undefined,
  assignedTeacher: undefined,
};

class ProjectsKanbanModalStore {
  private projectsService!: ProjectsService;
  private manager!: StoreManager;

  loading = new Loading();
  modalOpen = new Toggle(false);
  isEditFormMode = new Toggle(false);

  teachersAutocomplete!: AutocompleteControllerStore;
  studentsAutocomplete!: AutocompleteControllerStore;

  updateCallback = () => {};

  editingId?: TUid;

  @observable
  initialFormData: TProjectsKanbanModalStore = emptyFormData;

  constructor() {
    makeObservable(this);
  }

  init = (
    projectsService: ProjectsService,
    usersService: UsersService,
    manager: StoreManager
  ) => {
    this.projectsService = projectsService;
    this.manager = manager;

    this.teachersAutocomplete = new AutocompleteControllerStore(
      usersService.getTeachersShort
    );
    this.studentsAutocomplete = new AutocompleteControllerStore(
      usersService.getStudentsShort
    );
  };

  getFormDataById = async () => {
    if (!this.editingId) return;

    try {
      this.loading.start();
      const response = await this.projectsService.getFormDataById(
        this.editingId
      );
      return response;
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getFormDataById');
    } finally {
      this.loading.stop();
    }
  };

  changeFormData = async (newData: TProjectAdd) => {
    try {
      this.loading.start();

      const response: TProject = this.editingId
        ? await this.projectsService.changeRecord(this.editingId, newData)
        : await this.projectsService.addRecord(newData);

      this.manager.callToastSuccess('Данные успешно изменены');
      this.closeModal();
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getFormDataById');
    } finally {
      this.loading.stop();
    }
  };

  openCreate = async (updateCallback: () => void) => {
    this.updateCallback = updateCallback;
    this.modalOpen.enable();
  };

  openEdit = async (editingId: TUid, updateCallback: () => void) => {
    try {
      this.editingId = editingId;
      this.updateCallback = updateCallback;
      this.modalOpen.enable();
      this.isEditFormMode.enable();

      const newData = await this.getFormDataById();
      newData && this.updateInitialFormData(newData);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода openEdit');
    }
  };

  closeModal = () => {
    this.modalOpen.disable();
    this.loading.stop();
    this.isEditFormMode.disable();

    this.resetInitialFormData();
    this.updateCallback();
  };

  @action
  updateInitialFormData = (formData: TProjectsKanbanModalStore) => {
    this.initialFormData = { ...formData };
  };

  @action
  resetInitialFormData = () => {
    this.initialFormData = emptyFormData;
  };
}

export default ProjectsKanbanModalStore;
