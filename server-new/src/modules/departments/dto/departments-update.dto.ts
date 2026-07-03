import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class UpdateDepartmentDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
