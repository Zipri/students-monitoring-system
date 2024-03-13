import { action, makeObservable, observable } from 'mobx';
import { TGroup, TGroupAdd } from 'model/api/groups/types';
import { GroupsService } from 'model/services/groups';
import { UsersService } from 'model/services/users';

import { AutocompleteControllerStore, Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

class UniSettingsStore {
  private groupsService!: GroupsService;
  private manager!: StoreManager;

  @observable
  newGroup?: TGroupAdd;

  groups: TGroup[] = [];

  loadingGroups = new Loading();

  studentsAutocomplete!: AutocompleteControllerStore;

  constructor() {
    makeObservable(this);
  }

  init = (
    usersService: UsersService,
    groupsService: GroupsService,
    manager: StoreManager
  ) => {
    this.groupsService = groupsService;
    this.manager = manager;

    this.studentsAutocomplete = new AutocompleteControllerStore(
      usersService.getStudentsShort
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

  @action
  updateNewGroup = (newGroup?: TGroupAdd) => {
    this.newGroup = newGroup;
  };
}

export default UniSettingsStore;
