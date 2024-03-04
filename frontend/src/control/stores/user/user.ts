import { action, makeObservable, observable } from 'mobx';
import { TUser, TUserAdd, UsersRolesEnum } from 'model/api/users/types';
import { UsersService } from 'model/services/users';

const initialUserInfo: TUser = {
  id: '',
  username: '',
  email: '',
  role: UsersRolesEnum.student,
};

class UserStore {
  private usersService!: UsersService;

  @observable
  info: TUser = initialUserInfo;

  constructor() {
    makeObservable(this);
  }

  init = (usersService: UsersService) => {
    this.usersService = usersService;
  };

  login = async (email: string, password: string) => {
    try {
      const response = await this.usersService.loginUser(email, password);
      this.updateInfo(response);
    } catch (error) {
      console.error(error);
    }
  };

  registration = async (data: TUserAdd) => {
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
  };
}

export default UserStore;
