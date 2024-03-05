import { UsersApi } from '@api';
import { UsersService } from './users';

const services = {
  users: new UsersService(),
};

function ioc() {
  const usersApi = new UsersApi();

  services.users.init(usersApi);

  console.info('Общие сервисы инициализированы.');
}

ioc();

export default services;
