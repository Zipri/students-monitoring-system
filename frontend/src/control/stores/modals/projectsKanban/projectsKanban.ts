import { action, makeObservable, observable } from 'mobx';
import { TProject, TProjectAdd } from 'model/api/projects/types';
import { ProjectsService } from 'model/services/projects';

import { TUid } from '@api/types';
import { Loading, Toggle } from '@stores/common';
import { StoreManager } from '@stores/manager';

const emptyFormData: Partial<TProjectAdd> = {
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

  editingId?: TUid;

  @observable
  initialFormData: Partial<TProjectAdd> = emptyFormData;

  constructor() {
    makeObservable(this);
  }

  init = (projectsService: ProjectsService, manager: StoreManager) => {
    this.projectsService = projectsService;
    this.manager = manager;
  };

  getFormDataById = async () => {
    if (!this.editingId) return;

    try {
      this.loading.start();
      const response = await this.projectsService.getRecordById(this.editingId);
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

  openCreate = async () => {
    this.modalOpen.enable();
  };

  openEdit = async (editingId: TUid) => {
    try {
      this.editingId = editingId;
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
  };

  @action
  updateInitialFormData = (formData: TProjectAdd) => {
    this.initialFormData = { ...formData };
  };

  @action
  resetInitialFormData = () => {
    this.initialFormData = emptyFormData;
  };
}

export default ProjectsKanbanModalStore;
