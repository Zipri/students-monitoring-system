import { GroupsApi, UsersApi } from '@api';

import { GroupsService } from './groups';
import { UsersService } from './users';

const services = {
  users: new UsersService(),
  groups: new GroupsService(),
};

function ioc() {
  const usersApi = new UsersApi();
  const groupsApi = new GroupsApi();

  services.users.init(usersApi);
  services.groups.init(groupsApi);

  console.info('Общие сервисы инициализированы.');
}

ioc();

export default services;
