import { CommentsApi, GroupsApi, ProjectsApi, TasksApi, UsersApi } from '@api';

import { CommentsService } from './comments';
import { GroupsService } from './groups';
import { ProjectsService } from './projects';
import { TasksService } from './tasks';
import { UsersService } from './users';

const services = {
  users: new UsersService(),
  groups: new GroupsService(),
  projects: new ProjectsService(),
  tasks: new TasksService(),
  comments: new CommentsService(),
};

function ioc() {
  const usersApi = new UsersApi();
  const groupsApi = new GroupsApi();
  const projectsApi = new ProjectsApi();
  const tasksApi = new TasksApi();
  const commentsApi = new CommentsApi();

  services.users.init(usersApi);
  services.groups.init(groupsApi);
  services.projects.init(projectsApi);
  services.tasks.init(tasksApi);
  services.comments.init(commentsApi);

  console.info('Общие сервисы инициализированы.');
}

ioc();

export default services;
