import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from './dto/announcements.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditLog } from '../audit/decorators/audit-action.decorator';

@Controller('announcements')
@UseInterceptors(AuditInterceptor)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // публичный (над шапкой, видят все)
  @Get('current')
  current() {
    return this.announcementsService.getCurrent();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  all() {
    return this.announcementsService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'announcement', action: 'CREATE' })
  create(@Body() data: CreateAnnouncementDTO) {
    return this.announcementsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'announcement', action: 'UPDATE' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAnnouncementDTO,
    @Req() req: any,
  ) {
    req.oldData = await this.announcementsService.getById(id);
    return this.announcementsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'announcement', action: 'DELETE' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    req.oldData = await this.announcementsService.getById(id);
    return this.announcementsService.delete(id);
  }
}
