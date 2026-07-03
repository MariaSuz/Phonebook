import { ViewUserDTO } from '../modules/users/dto/user-view.dto';
import { users } from '@prisma/client';

export class UserViewMapper {
  mapOne(data: users): ViewUserDTO {
    return {
      id: data.id,
      userName: data.userName,
      roleId: data.roleId,
    };
  }

  mapMany(data: users[]): ViewUserDTO[] {
    return data.map((one) => this.mapOne(one));
  }
}
