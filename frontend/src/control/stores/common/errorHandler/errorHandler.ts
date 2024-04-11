import { ReactNode } from 'react';

import { AxiosError } from 'axios';

import { StoreManager } from '@stores/manager';

class ErrorHandlerStore {
  private manager!: StoreManager;
  private getMessageFromObject = (obj: Object): string => {
    if (typeof obj === 'string') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.getMessageFromObject).join(', ');
    }

    if (typeof obj === 'object') {
      return Object.values(obj).map(this.getMessageFromObject).join(', ');
    }

    return '';
  };

  init = (manager: StoreManager) => {
    this.manager = manager;
  };

  log = (error: Error | AxiosError) => {
    console.error(error);
  };

  toast = (error: string, details?: ReactNode) =>
    this.manager.callToastError(error, details);

  backendError = (error: AxiosError, defaultError: string) => {
    const responseData = error.response?.data;
    if (!responseData) {
      this.toast(defaultError);
      return;
    }

    const errorMessage = this.getMessageFromObject(responseData);

    if (errorMessage.length) {
      this.toast(defaultError, errorMessage);
    } else {
      this.toast(defaultError);
    }
  };
}

export default ErrorHandlerStore;
