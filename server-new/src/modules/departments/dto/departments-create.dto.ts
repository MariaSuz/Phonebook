import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
