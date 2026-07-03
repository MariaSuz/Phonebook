import { IsString, IsInt, IsOptional, IsEmail } from 'class-validator';

export class CreateEmployeeDTO {
  @IsInt()
  departmentId: number;

  @IsOptional()
  @IsString()
  cabinet?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  internalPhone?: string;

  @IsOptional()
  @IsString()
  cityPhone?: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
