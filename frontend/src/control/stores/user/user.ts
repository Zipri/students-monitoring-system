import { action, makeObservable, observable } from 'mobx';
import { TGroup } from 'model/api/groups/types';
import {
  TUser,
  TUserRegistration,
  UsersRolesEnum,
} from 'model/api/users/types';
import { GroupsService } from 'model/services/groups';
import { UsersService } from 'model/services/users';

import { AutocompleteControllerStore, Loading } from '@stores/common';
import { StoreManager } from '@stores/manager';

const initialUserInfo: TUser = {
  id: '',
  username: '',
  email: '',
  role: UsersRolesEnum.student,
};

class UserStore {
  private usersService!: UsersService;
  private groupsService!: GroupsService;
  private manager!: StoreManager;

  @observable
  info: TUser = initialUserInfo;

  groups: TGroup[] = [];

  loadingDropdown = new Loading();
  loading = new Loading();

  groupsAutocomplete!: AutocompleteControllerStore;

  constructor() {
    makeObservable(this);
  }

  init = (
    usersService: UsersService,
    groupsService: GroupsService,
    manager: StoreManager
  ) => {
    this.usersService = usersService;
    this.groupsService = groupsService;
    this.manager = manager;

    this.groupsAutocomplete = new AutocompleteControllerStore(
      groupsService.getListItems
    );

    const storedInfo = localStorage.getItem('user-info');
    const initialValue = storedInfo ? JSON.parse(storedInfo) : initialUserInfo;
    this.info = initialValue;
  };

  getStudentGroups = async () => {
    if (this.groups.length) return this.groups;

    try {
      this.loadingDropdown.start();
      const response = await this.groupsService.getListItems();
      this.groups.push(...response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка получения');
    } finally {
      this.loadingDropdown.stop();
    }
  };

  login = async (email: string, password: string) => {
    try {
      const response = await this.usersService.loginUser(email, password);
      this.updateInfo(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка входа');
    }
  };

  logout = () => this.updateInfo(initialUserInfo);

  registration = async (data: TUserRegistration) => {
    try {
      const response = await this.usersService.registrationUser(data);
      this.updateInfo(response);
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка регистрации');
    }
  };

  changeUserData = async (data: TUser) => {
    try {
      this.loading.start();
      const response = await this.usersService.updateRecord(this.info.id, data);
      this.updateInfo(response);
      this.manager.callToastSuccess('Данные успешно изменены');
    } catch (error) {
      this.manager.callBackendError(error, 'Ошибка changeUserData');
    } finally {
      this.loading.stop();
    }
  };

  @action
  updateInfo = (info: TUser) => {
    this.info = info;
    localStorage.setItem('user-info', JSON.stringify(info));
  };
}

export default UserStore;
