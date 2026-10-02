import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateTechSiteDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false, require_protocol: true })
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
