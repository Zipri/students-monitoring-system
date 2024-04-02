import { LogicRoot } from 'model';

import { ErrorHandlerStore } from '@stores/common';
import { ProjectsKanbanModalStore, TaskModalStore } from '@stores/modals';

import { StoreManager } from './storeManager';
import { ProjectsStore } from './stores/projects';
import { ProjectsKanbanStore } from './stores/projectsKanban';
import { ToastStore } from './stores/toast';
import { UserStore } from './stores/user';
import { TasksKanbanStore } from './stores/tasksKanban';
import { UniSettingsStore } from './stores/uniSettings';
import { ProjectFiltersWithUrlStore } from './stores/projectFiltersWithUrl';
import { TimelineTasksStore } from './stores/timelineTasks';
import { TasksStatisticStore } from './stores/tasksStatistic';
import { ProjectsStatisticStore } from './stores/projectsStatistic';

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

  /** стор для компонента фильтров проектов в урл */
  public projectFiltersWithUrl = new ProjectFiltersWithUrlStore();

  /** информация о пользователе и его права */
  public user = new UserStore();
  /** страница проектов */
  public projects = new ProjectsStore();
  /** страница всех проектов пользователя на одной канбан доске */
  public projectsKanban = new ProjectsKanbanStore();
  /** страница всех задач проекта на одной канбан доске */
  public tasksKanban = new TasksKanbanStore();
  /** страница всех задач проекта на таймлайне */
  public timelineTasks = new TimelineTasksStore();
  /** страница вузовских настроек */
  public uniSettings = new UniSettingsStore();
  /** страница статистика по проектам группы */
  public projectsStatistic = new ProjectsStatisticStore();
  /** страница статистика по задачам */
  public tasksStatistic = new TasksStatisticStore();

  /** Модалка для редактирования страницы projectsKanban */
  public projectsKanbanModal = new ProjectsKanbanModalStore();
  /** Модалка для работы с одной задачей */
  public taskModal = new TaskModalStore();

  constructor() {
    this.init();
  }

  init() {
    const { services, manager } = this;

    this.errorHandler.init(manager);

    // Страницы
    this.user.init(services.users, services.groups, manager);
    this.projects.init(services.projects, services.users, manager);
    this.projectsKanban.init(services.projects, manager);
    this.tasksKanban.init(services.tasks, manager);
    this.timelineTasks.init(services.tasks, manager);
    this.uniSettings.init(
      services.users,
      services.groups,
      services.projects,
      manager
    );
    this.tasksStatistic.init(services.tasks, services.projects, manager);
    this.projectsStatistic.init(
      services.tasks,
      services.projects,
      services.users,
      manager
    );

    // Модалки
    this.projectsKanbanModal.init(services.projects, services.users, manager);
    this.taskModal.init(services.tasks, services.comments, manager);

    this.projectFiltersWithUrl.init(services.projects, manager);
  }
}

const rootStoreInstance = new RootStore();

export { RootStore, rootStoreInstance };
