import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;
}
