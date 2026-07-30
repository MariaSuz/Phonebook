import { ViewUserDTO } from '../../users/dto/user-view.dto';

export class AccessDTO extends ViewUserDTO {
  token: string;
}
