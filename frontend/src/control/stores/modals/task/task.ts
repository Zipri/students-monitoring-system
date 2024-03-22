import { action, makeObservable, observable } from 'mobx';
import {
  TTask,
  TTaskAdd,
  TaskPriorityEnum,
  TaskStatusEnum,
} from 'model/api/tasks/types';
import { TasksService } from 'model/services/tasks';

import { Loading, Toggle } from '@stores/common';
import { StoreManager } from '@stores/manager';

import { TTaskModalStore } from './types';
import { TUid } from '@api/types';

const emptyFormData: TTaskModalStore = {
  projectId: undefined,
  title: undefined,
  description: undefined,
  status: TaskStatusEnum.new,
  priority: TaskPriorityEnum.low,
  startDate: undefined,
  deadline: undefined,
};

class TaskModalStore {
  private tasksService!: TasksService;
  private manager!: StoreManager;

  loading = new Loading();
  modalOpen = new Toggle(false);
  isEditFormMode = new Toggle(false);

  @observable
  initialFormData: TTaskModalStore = emptyFormData;

  editingId?: TUid;

  constructor() {
    makeObservable(this);
  }

  init = (tasksService: TasksService, manager: StoreManager) => {
    this.tasksService = tasksService;
    this.manager = manager;
  };

  getFormDataById = async () => {
    if (!this.editingId) return;

    try {
      this.loading.start();
      //   const response = await this.tasksService.getFormDataById(
      //     this.editingId
      //   );
      //   return response;
      //   return response;
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getFormDataById');
    } finally {
      this.loading.stop();
    }
  };

  changeFormData = async (newData: TTaskAdd) => {
    try {
      this.loading.start();

      //   const response: TTask = this.editingId
      //     ? await this.tasksService.changeRecord(this.editingId, newData)
      //     : await this.tasksService.addRecord(newData);

      this.manager.callToastSuccess('Данные успешно изменены');
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

      const newData = await this.getFormDataById();
      //   newData && this.updateInitialFormData(newData);
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
  updateInitialFormData = (formData: TTaskModalStore) => {
    this.initialFormData = { ...formData };
  };

  @action
  resetInitialFormData = () => {
    this.initialFormData = emptyFormData;
  };
}

export default TaskModalStore;
