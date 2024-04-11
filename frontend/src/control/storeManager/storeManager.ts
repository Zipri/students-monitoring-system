import { ReactNode } from 'react';

import { AxiosError } from 'axios';
import { RootStore } from 'control/ioc';
import { TToastMessage } from 'control/stores/toast/types';

/** Данный класс-сервис используется для связи одного стора с другим.
 * Если Вам нужно вызвать из одного стора обратиться к другому,
 * добавьте в этот класс функцию */
class StoreManager {
  private root!: RootStore;

  constructor(root: RootStore) {
    this.root = root;
  }

  callToastSuccess = (text: string) => {
    this.root.toast.success(text);
  };

  callToastError = (text: string, details?: ReactNode) => {
    this.root.toast.error(text, details);
  };

  callToastInfo = (text: string) => {
    this.root.toast.info(text);
  };

  callToast = (toast: TToastMessage) => {
    this.root.toast.show(toast);
  };

  handleError = () => {
    return this.root.errorHandler;
  };

  callBackendError = (error: any, analog: string) => {
    this.root.errorHandler.backendError(error as AxiosError, analog);
  };

  getUserInfo = () => {
    return this.root.user.info;
  };

  getUrlProjectId = () => {
    return this.root.projectFiltersWithUrl.projectId;
  };

  getUrlProject = () => {
    return this.root.projectFiltersWithUrl.project;
  };
}

export default StoreManager;
