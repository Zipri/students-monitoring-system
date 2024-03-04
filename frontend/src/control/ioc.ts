import { LogicRoot } from 'model';
import { UserStore } from './stores/user';

const { services } = LogicRoot;

class RootStore {
  //сервисы - иногда может потребоваться быстрый доступ к ним
  public services = services;

  //информация о пользователе и его права
  public user = new UserStore();

  constructor() {
    this.init();
  }

  init() {
    const { services } = this;

    this.user.init(services.users);
  }
}

const rootStoreInstance = new RootStore();

export { RootStore, rootStoreInstance };
