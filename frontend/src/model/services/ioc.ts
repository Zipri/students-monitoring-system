import { GroupsApi, ProjectsApi, UsersApi } from '@api';

import { GroupsService } from './groups';
import { ProjectsService } from './projects';
import { UsersService } from './users';

const services = {
  users: new UsersService(),
  groups: new GroupsService(),
  projects: new ProjectsService(),
};

function ioc() {
  const usersApi = new UsersApi();
  const groupsApi = new GroupsApi();
  const projectsApi = new ProjectsApi();

  services.users.init(usersApi);
  services.groups.init(groupsApi);
  services.projects.init(projectsApi);

  console.info('Общие сервисы инициализированы.');
}

ioc();

export default services;
