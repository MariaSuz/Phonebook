import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  userName?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  roleId: number;
}
