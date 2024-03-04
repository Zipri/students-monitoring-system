import { action, makeObservable, observable } from 'mobx';
import { TUser, UsersRolesEnum } from 'model/api/users/types';
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

  getAllUsers = async () => {
    try {
      const response = await this.usersService.getListItems();
      console.log(response);
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
