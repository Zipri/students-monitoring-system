import { action, makeObservable, observable } from 'mobx';
import { TGroup } from 'model/api/groups/types';
import {
  TUser,
  TUserRegistration,
  UsersRolesEnum,
} from 'model/api/users/types';
import { GroupsService } from 'model/services/groups';
import { UsersService } from 'model/services/users';

import { Loading } from '@stores/common';

const initialUserInfo: TUser = {
  id: '',
  username: '',
  email: '',
  role: UsersRolesEnum.student,
};

class UserStore {
  private usersService!: UsersService;
  private groupsService!: GroupsService;

  @observable
  info: TUser = initialUserInfo;

  groups: TGroup[] = [];

  loadingDropdown = new Loading();

  constructor() {
    makeObservable(this);
  }

  init = (usersService: UsersService, groupsService: GroupsService) => {
    this.usersService = usersService;
    this.groupsService = groupsService;

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
      console.error(error);
    } finally {
      this.loadingDropdown.stop();
    }
  };

  login = async (email: string, password: string) => {
    try {
      const response = await this.usersService.loginUser(email, password);
      this.updateInfo(response);
    } catch (error) {
      console.error(error);
    }
  };

  logout = () => this.updateInfo(initialUserInfo);

  registration = async (data: TUserRegistration) => {
    try {
      const response = await this.usersService.registrationUser(data);
      this.updateInfo(response);
    } catch (error) {
      console.error(error);
    }
  };

  @action
  updateInfo = (info: TUser) => {
    this.info = info;
    localStorage.setItem('user-info', JSON.stringify(info));
  };
}

export default UserStore;
