import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';

export class AuthDTO {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsInt()
  roleId: number;
}
