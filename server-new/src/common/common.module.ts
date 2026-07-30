import { Module } from '@nestjs/common';
import { HashService } from './utils/hash.service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class CommonModule {}
