import { makeObservable, observable } from 'mobx';
import { IToastStore, TToastMessage } from './types';

class ToastStore implements IToastStore {
  @observable
  messages?: TToastMessage[];

  needReset = false;

  constructor() {
    makeObservable(this);
  }

  show = (options: TToastMessage | TToastMessage[]) => {
    const newMessages = Array.isArray(options) ? options : [options];
    let tempMessages = this.messages || [];
    if (this.needReset) {
      this.needReset = false;
      tempMessages = [];
    }
    this.messages = [...tempMessages, ...newMessages];
  };

  // Для исключения лишнего рендера при сбросе messages
  shown = () => {
    this.needReset = true;
  };

  success = (summary: React.ReactNode, detail?: React.ReactNode) => {
    this.show({
      severity: 'success',
      summary,
      detail,
      life: 3000,
    });
  };

  info = (summary: React.ReactNode, detail?: React.ReactNode) => {
    this.show({
      severity: 'info',
      summary,
      detail,
      life: 3000,
    });
  };

  warn = (summary: React.ReactNode, detail?: React.ReactNode) => {
    this.show({
      severity: 'warn',
      summary,
      detail,
      life: 3000,
    });
  };

  error = (summary: React.ReactNode, detail?: React.ReactNode) => {
    this.show({
      severity: 'error',
      summary,
      detail,
      life: 3000,
    });
  };

  clear = () => {
    this.messages = undefined;
  };
}

export default ToastStore;
