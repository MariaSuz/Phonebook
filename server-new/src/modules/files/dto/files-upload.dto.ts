import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadFileDTO {
  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  groupId: number;
}
