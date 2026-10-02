import { Module } from '@nestjs/common';
import { TechSitesController } from './tech-sites.controller';
import { TechSitesService } from './tech-sites.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TechSitesController],
  providers: [TechSitesService],
})
export class TechSitesModule {}
