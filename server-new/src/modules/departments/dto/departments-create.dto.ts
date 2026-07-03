import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
