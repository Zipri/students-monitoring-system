import {
  TResponseDeletedCount,
  TResponseError,
  TResponseModifiedCount,
  TResponseResult,
  TUid,
} from '@api/types';

export enum UsersRolesEnum {
  student = 'Студент',
  teacher = 'Преподаватель',
}

export type TUser = {
  id: TUid;
  username: string;
  /** Уникальное поле */
  email: string;
  role: UsersRolesEnum;
  /** Может быть не указан для ролей, отличных от студента */
  group?: string;
};

export type TUserAdd = {
  username: string;
  email: string;
  /** Пароль требуется только при добавлении пользователя и хэшируется на бэке */
  password: string;
  role: UsersRolesEnum;
  /** Может быть не указан для ролей, отличных от студента */
  group?: string;
};

export type TUserUpdate = Partial<Omit<TUserAdd, 'password'>> & { id: TUid };

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserRegistration = {
  username: string;
  email: string;
  /** Пароль требуется только при добавлении пользователя и хэшируется на бэке */
  password: string;
  role: UsersRolesEnum;
  /** Может быть не указан для ролей, отличных от студента */
  group?: string;
  groupId?: TUid;
};

export type TGetUsersByGroupParams = {
  group_name: string;
};

export type TGetUsersByRoleParams = {
  role_name: UsersRolesEnum;
};

// Get list: Ответ на получение списка пользователей
export type TGetListUsersResponse = TUser[];

// Post record: Ответ на добавление нового пользователя
export type TPostUsersParams = TUserAdd;
export type TPostUsersRequest = TUserAdd;
export type TPostUsersResponse = TUser;

// Put record: Ответ на обновление пользователя
export type TPutUsersParams = { id: TUid; data: TUserUpdate };
export type TPutUsersRequest = TUserUpdate;
export type TPutUsersResponse = TResponseModifiedCount;

// Delete record: Ответ на удаление пользователя
export type TDeleteUsersResponse = TResponseDeletedCount;

// Login: Ответ на вход пользователя
export type TLoginParams = TUserLogin;
export type TLoginRequest = TUserLogin;
export type TLoginResponse = TUser & { token?: string };

// Registration
export type TRegistrationParams = TUserRegistration;
export type TRegistrationRequest = TUserRegistration;
export type TRegistrationResponse = TUser;

// Ответ на получение пользователей по группе
export type TGetListUsersByGroupResponse = TUser[];

// Ответ на получение пользователей по роли
export type TGetListUsersByRoleResponse = TUser[];
