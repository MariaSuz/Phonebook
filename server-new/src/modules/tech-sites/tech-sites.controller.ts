import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TechSitesService } from './tech-sites.service';
import { CreateTechSiteDTO } from './dto/tech-sites-create.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AdminGuard } from '../../guards/roles.guard';

@Controller('tech-sites')
@UseInterceptors(AuditInterceptor)
export class TechSitesController {
  constructor(private readonly techSitesService: TechSitesService) {}

  @Get()
  allSites() {
    return this.techSitesService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() data: CreateTechSiteDTO) {
    return this.techSitesService.create(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.techSitesService.delete(id);
  }
}
