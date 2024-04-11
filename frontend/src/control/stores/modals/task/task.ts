import { action, makeObservable, observable } from 'mobx';
import { TaskPriorityEnum, TaskStatusEnum, TTask } from 'model/api/tasks/types';
import { CommentsService } from 'model/services/comments';
import { TasksService } from 'model/services/tasks';

import { TUid } from '@api/types';
import { Loading, Toggle } from '@stores/common';
import { StoreManager } from '@stores/manager';

import { TTaskModalStore } from './types';
import { TComment } from 'model/api/comments/types';

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
  private commentsService!: CommentsService;
  private manager!: StoreManager;

  loading = new Loading();
  modalOpen = new Toggle(false);
  isEditFormMode = new Toggle(false);

  @observable
  initialFormData: TTaskModalStore = emptyFormData;

  @observable
  comments: TComment[] = [];

  @observable
  editingId?: TUid;

  updateCallback = () => {};

  constructor() {
    makeObservable(this);
  }

  init = (
    tasksService: TasksService,
    commentsService: CommentsService,
    manager: StoreManager
  ) => {
    this.tasksService = tasksService;
    this.commentsService = commentsService;
    this.manager = manager;
  };

  //#region Commetns
  getComments = async () => {
    if (!this.editingId) return;

    try {
      this.loading.start();
      const response = await this.commentsService.getCommentsByTaskId(
        this.editingId
      );
      this.updateComments(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getComments');
    } finally {
      this.loading.stop();
    }
  };

  addComment = async (taskId: TUid, authorId: TUid, text: string) => {
    if (!text.length) {
      this.manager.callToastError('Необходимо написать текст комментария');
      return;
    }
    try {
      this.loading.start();
      const response = await this.commentsService.addRecord({
        taskId,
        authorId,
        text,
      });

      this.updateComments([...this.comments, response]);

      this.manager.callToastSuccess('Комментарий добавлен');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода addComment');
    } finally {
      this.loading.stop();
    }
  };

  updateComment = async (id: TUid, text: string) => {
    try {
      this.loading.start();
      const response = await this.commentsService.changeRecord(id, { text });

      const newData = this.comments.map((comment) => {
        if (comment.id === response.id) return response;
        return comment;
      });

      this.updateComments(newData);

      this.manager.callToastSuccess('Комментарий изменен');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода updateComment');
    } finally {
      this.loading.stop();
    }
  };

  deleteComment = async (id: TUid) => {
    try {
      this.loading.start();
      await this.commentsService.deleteRecord(id);

      const newData = this.comments.filter((comment) => comment.id !== id);

      this.updateComments(newData);
      this.manager.callToastSuccess('Комментарий удален');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода updateComment');
    } finally {
      this.loading.stop();
    }
  };
  //#endregion

  getFormDataById = async () => {
    if (!this.editingId) return;

    try {
      this.loading.start();
      const response = await this.tasksService.getTaskFormDataById(
        this.editingId
      );
      this.updateInitialFormData(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getFormDataById');
    } finally {
      this.loading.stop();
    }
  };

  changeFormData = async (newData: TTaskModalStore) => {
    if (!this.initialFormData.projectId) {
      this.manager.callToastError('Нет projectId');
      return;
    }
    try {
      this.loading.start();

      const response: TTaskModalStore = this.editingId
        ? await this.tasksService.changeFormRecord(this.editingId, newData)
        : await this.tasksService.addFormRecord(newData);

      this.updateInitialFormData(response);
      this.updateEditingId(response.id);

      this.manager.callToastSuccess('Данные успешно изменены');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода changeFormData');
    } finally {
      this.loading.stop();
    }
  };

  openCreate = async (updateCallback: () => void, projectId?: TUid) => {
    this.updateCallback = updateCallback;

    this.modalOpen.enable();
    this.isEditFormMode.enable();

    this.updateInitialFormData({ ...this.initialFormData, projectId });
  };

  openEdit = async (
    updateCallback: () => void,
    editingId: TUid,
    projectId?: TUid
  ) => {
    try {
      this.updateCallback = updateCallback;

      this.updateEditingId(editingId);
      this.updateInitialFormData({ ...this.initialFormData, projectId });

      this.modalOpen.enable();

      await this.getFormDataById();
      await this.getComments();
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода openEdit');
    }
  };

  closeModal = () => {
    this.modalOpen.disable();
    this.loading.stop();
    this.isEditFormMode.disable();

    this.updateEditingId(undefined);
    this.updateComments([]);
    this.resetInitialFormData();

    this.updateCallback();
    this.updateCallback = () => {};
  };

  deleteTask = async (id: TUid) => {
    try {
      await this.tasksService.deleteRecord(id);
      this.manager.callToastSuccess('Запись успешно удалена');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода openEdit');
    }
  };

  @action
  updateEditingId = (id?: TUid) => {
    this.editingId = id;
  };

  @action
  updateComments = (comments: TComment[]) => {
    this.comments = [...comments];
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
