import { IsIn, IsOptional, Matches } from 'class-validator';
import { PaginationDTO } from '../../../common/dto/pagination.dto';

export class AuditQueryDTO extends PaginationDTO {
  @IsOptional()
  @IsIn(['CREATE', 'UPDATE', 'DELETE'])
  action?: 'CREATE' | 'UPDATE' | 'DELETE';

  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month must be in YYYY-MM format',
  })
  month?: string;
}
