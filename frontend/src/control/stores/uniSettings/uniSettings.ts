import { action, makeObservable, observable } from 'mobx';
import { TGroup, TGroupAdd } from 'model/api/groups/types';
import { GroupsService } from 'model/services/groups';
import { UsersService } from 'model/services/users';

import { AutocompleteControllerStore, Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';
import { TUser, TUserAdd } from 'model/api/users/types';

class UniSettingsStore {
  private groupsService!: GroupsService;
  private usersService!: UsersService;
  private manager!: StoreManager;

  @observable
  newGroup?: TGroupAdd;

  @observable
  newStudent?: TUserAdd;

  groups: TGroup[] = [];
  students: TUser[] = [];
  teachers: TUser[] = [];

  loadingGroups = new Loading();
  loadingStudents = new Loading();
  loadingTeachers = new Loading();

  studentsAutocomplete!: AutocompleteControllerStore;
  groupsAutocomplete!: AutocompleteControllerStore;

  constructor() {
    makeObservable(this);
  }

  init = (
    usersService: UsersService,
    groupsService: GroupsService,
    manager: StoreManager
  ) => {
    this.groupsService = groupsService;
    this.usersService = usersService;
    this.manager = manager;

    this.studentsAutocomplete = new AutocompleteControllerStore(
      usersService.getStudentsShort
    );
    this.groupsAutocomplete = new AutocompleteControllerStore(
      groupsService.getListItems
    );
  };

  getGroups = async () => {
    if (this.groups.length) return this.groups;

    try {
      this.loadingGroups.start();
      const response = await this.groupsService.getListItems();
      const sorted = response.sort();
      this.groups.push(...sorted);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка получения групп');
    } finally {
      this.loadingGroups.stop();
    }
  };

  addGroup = async () => {
    if (!this.newGroup) return;
    if (!this.newGroup.name) {
      this.manager.callToastError('Необходимо ввести группу');
      return;
    }

    try {
      this.loadingGroups.start();

      const response = await this.groupsService.addRecord(this.newGroup);

      this.groups.push(response);
      this.updateNewGroup(undefined);

      this.manager.callToastSuccess('Группа успешно добавлена');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка получения групп');
    } finally {
      this.loadingGroups.stop();
    }
  };

  getStudents = async () => {
    if (this.students.length) return this.students;

    try {
      this.loadingStudents.start();
      const response = await this.usersService.getStudents();
      const sorted = response.sort();
      this.students.push(...sorted);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка получения students');
    } finally {
      this.loadingStudents.stop();
    }
  };

  getTeachers = async () => {
    if (this.teachers.length) return this.teachers;

    try {
      this.loadingTeachers.start();
      const response = await this.usersService.getTeachers();
      const sorted = response.sort();
      this.teachers.push(...sorted);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка получения teachers');
    } finally {
      this.loadingTeachers.stop();
    }
  };

  @action
  updateNewGroup = (newGroup?: TGroupAdd) => {
    this.newGroup = newGroup;
  };

  @action
  updateNewStudent = (newStudent?: TUserAdd) => {
    this.newStudent = newStudent;
  };
}

export default UniSettingsStore;
