import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from './dto/announcements.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  // для полосы: всё, что ещё не завершилось
  async getCurrent() {
    return await this.prisma.announcements.findMany({
      where: { endsAt: { gt: new Date() } },
      orderBy: { startsAt: 'asc' },
    });
  }

  async getAll() {
    return await this.prisma.announcements.findMany({
      orderBy: { startsAt: 'desc' },
    });
  }

  async create(data: CreateAnnouncementDTO) {
    this.checkPeriod(data);
    return await this.prisma.announcements.create({
      data: {
        message: data.message.trim(),
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        showBeforeHours: data.showBeforeHours,
      },
    });
  }

  async update(id: number, data: UpdateAnnouncementDTO) {
    await this.getById(id);
    this.checkPeriod(data);
    return await this.prisma.announcements.update({
      where: { id },
      data: {
        message: data.message.trim(),
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        showBeforeHours: data.showBeforeHours,
      },
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return await this.prisma.announcements.delete({ where: { id } });
  }

  async getById(id: number) {
    const item = await this.prisma.announcements.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Анонс не найден');
    return item;
  }

  private checkPeriod(data: { startsAt: string; endsAt: string }) {
    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      throw new BadRequestException('Окончание должно быть позже начала');
    }
  }
}
