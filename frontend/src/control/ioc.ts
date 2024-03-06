import { LogicRoot } from 'model';

import { ErrorHandlerStore } from '@stores/common';

import { StoreManager } from './storeManager';
import { ProjectsStore } from './stores/projects';
import { ToastStore } from './stores/toast';
import { UserStore } from './stores/user';
import { ProjectsKanbanStore } from './stores/projectsKanban';

const { services } = LogicRoot;

class RootStore {
  //сервисы - иногда может потребоваться быстрый доступ к ним
  public services = services;
  //когда нужно из одного стора обратиться к другому, следует использовать данный менеджер.
  public manager = new StoreManager(this);

  /** стор для системных сообщений */
  public toast = new ToastStore();
  /** отдельный стор для кастомизации вывода ошибок (в т.ч. вывод ошибок с бэка в тост) */
  public errorHandler = new ErrorHandlerStore();

  /** информация о пользователе и его права */
  public user = new UserStore();
  /** страница проектов */
  public projects = new ProjectsStore();
  /** страница всех проектов пользователя на одной канбан доске */
  public projectsKanban = new ProjectsKanbanStore();

  constructor() {
    this.init();
  }

  init() {
    const { services, manager } = this;

    this.errorHandler.init(manager);

    this.user.init(services.users, services.groups, manager);
    this.projects.init(services.projects, services.users, manager);
    this.projectsKanban.init(services.projects, manager);
  }
}

const rootStoreInstance = new RootStore();

export { RootStore, rootStoreInstance };
