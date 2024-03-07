import { GroupsApi, ProjectsApi, TasksApi, UsersApi } from '@api';

import { GroupsService } from './groups';
import { ProjectsService } from './projects';
import { TasksService } from './tasks';
import { UsersService } from './users';

const services = {
  users: new UsersService(),
  groups: new GroupsService(),
  projects: new ProjectsService(),
  tasks: new TasksService(),
};

function ioc() {
  const usersApi = new UsersApi();
  const groupsApi = new GroupsApi();
  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();

  services.users.init(usersApi);
  services.groups.init(groupsApi);
  services.projects.init(projectsApi);
  services.tasks.init(tasksApi);

  console.info('Общие сервисы инициализированы.');
}

ioc();

export default services;
