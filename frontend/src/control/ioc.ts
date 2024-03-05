import { LogicRoot } from 'model';

import { ToastStore } from './stores/toast';
import { UserStore } from './stores/user';
import { ProjectsStore } from './stores/projects';

const { services } = LogicRoot;

class RootStore {
  //сервисы - иногда может потребоваться быстрый доступ к ним
  public services = services;

  /** информация о пользователе и его права */
  public user = new UserStore();
  /** страница проектов */
  public projects = new ProjectsStore();

  /** стор для системных сообщений */
  public toast = new ToastStore();

  constructor() {
    this.init();
  }

  init() {
    const { services } = this;

    this.user.init(services.users, services.groups);
    this.projects.init(services.projects, services.users);
  }
}

const rootStoreInstance = new RootStore();

export { RootStore, rootStoreInstance };
