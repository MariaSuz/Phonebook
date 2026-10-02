import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  message: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsIn([0, 24, 72, 168])
  showBeforeHours: number;
}

export class UpdateAnnouncementDTO extends CreateAnnouncementDTO {}
