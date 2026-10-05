export interface UserCreateModel {
  userName: string;
  roleId: number;
  password: string;
  avatar?: string;
}

export interface User {
  id: number;
  userName: string;
  roleId: number;
  avatar?: string;
}

export interface UserUpdateModel {
  userName: string;
  roleId: number;
  password?: string;
  avatar?: string;
}
