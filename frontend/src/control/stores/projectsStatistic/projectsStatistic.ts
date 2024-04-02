import { action, makeObservable, observable } from 'mobx';
import { TGroup, TGroupStudents } from 'model/api/groups/types';
import { TUser } from 'model/api/users/types';
import { ProjectsService } from 'model/services/projects';
import { TasksService } from 'model/services/tasks';
import { UsersService } from 'model/services/users';

import { TUid } from '@api/types';
import { Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

import { ProjectStatistic } from './types';

class ProjectsStatisticStore {
  private tasksService!: TasksService;
  private projectsService!: ProjectsService;
  private usersService!: UsersService;
  private manager!: StoreManager;

  @observable
  group: TGroup = {
    id: '65e6f4002818f1e35642a6d0',
    name: '\u0418\u04235-63\u0411',
    students: [
      {
        email: 'zimmermansusan@e-ItI#3ZqiDr-xample.com',
        id: '65e6f4012818f1e35642a6e3',
        name: 'smithchristopher',
      },
      {
        email: 'jmarsh@e-+L7gTLn)Tu-xample.com',
        id: '65e6f4012818f1e35642a6e5',
        name: 'jonathan06',
      },
      {
        email: 'mburns@e-KS(2CeHkU^-xample.org',
        id: '65e6f4012818f1e35642a6e8',
        name: 'jefferysalazar',
      },
      {
        email: 'mary91@e-2ys71dKz_@-xample.net',
        id: '65e6f4012818f1e35642a6f1',
        name: 'estescarrie',
      },
      {
        email: 'michael31@e-v04hCzxV$o-xample.org',
        id: '65e6f4022818f1e35642a701',
        name: 'ghernandez',
      },
      {
        email: 'sandovaltroy@e-^&KbW2he5L-xample.com',
        id: '65e6f4032818f1e35642a705',
        name: 'josephroberts',
      },
      {
        email: 'jodi71@e-5oqD)RHk$B-xample.com',
        id: '65e6f4032818f1e35642a70a',
        name: 'alexandershaw',
      },
      {
        email: 'cody22@e-wkL5N$jQj#-xample.org',
        id: '65e6f4042818f1e35642a715',
        name: 'davidsonmichael',
      },
    ],
  };

  @observable
  students: TGroupStudents[] = [];

  @observable
  statisticProjects: ProjectStatistic[] = [];

  userInfo!: TUser;

  loading = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (
    tasksService: TasksService,
    projectsService: ProjectsService,
    usersService: UsersService,
    manager: StoreManager
  ) => {
    this.tasksService = tasksService;
    this.projectsService = projectsService;
    this.usersService = usersService;
    this.manager = manager;

    this.userInfo = this.manager.getUserInfo();
  };

  // Получаем список студентов
  getStudentsByGroup = async () => {
    if (!this.group) {
      this.manager.callToastError('Выберите группу');
      return;
    }
    try {
      this.loading.start();
      //   const response = await this.usersService.getStudentsByGroup(this.group.name);
      this.updateStudents(this.group.students);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getStudentsByGroup');
    } finally {
      this.loading.stop();
    }
  };

  // Получаем список проектов этих студентов
  // (цикл по студентам с выводом проектов каждого)
  getProjectsByGroup = async () => {
    if (!this.group) {
      this.manager.callToastError('Выберите группу');
      return;
    }
    try {
      this.loading.start();

      await this.getStudentsByGroup();
      const response = await this.projectsService.getProjectsBuGroup(
        this.group.name
      );

      const getNewStatisticProjects = async () => {
        // Использование Promise.all для ожидания всех асинхронных операций
        return await Promise.all(
          response.map(async (project) => {
            const tasks = await this.getTasksByProject(project.id);

            return {
              project,
              tasks: tasks || [],
            };
          })
        );
      };

      // Дожидаемся результата асинхронной функции
      const statisticProjects = await getNewStatisticProjects();
      console.log(statisticProjects);
      this.updateStatisticProjects(statisticProjects);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getStudentsByGroup');
    } finally {
      this.loading.stop();
    }
  };

  // Список задач, чтобы заполнить информацию о завершенности каждого проекта
  getTasksByProject = async (projectId: TUid) => {
    try {
      this.loading.start();
      const response = await this.tasksService.getListByProjectId(projectId);
      return response;
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка метода getStudentsByGroup');
    } finally {
      this.loading.stop();
    }
  };

  reset = () => {
    this.updateStatisticProjects([]);

    this.loading.stop();
  };

  @action
  updateGroup = (data: TGroup) => {
    this.group = data;
  };

  @action
  updateStudents = (data: TGroupStudents[]) => {
    this.students = data;
  };

  @action
  updateStatisticProjects = (data: ProjectStatistic[]) => {
    this.statisticProjects = data;
  };
}

export default ProjectsStatisticStore;
