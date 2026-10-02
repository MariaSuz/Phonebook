import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTechSiteDTO } from './dto/tech-sites-create.dto';

@Injectable()
export class TechSitesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.tech_sites.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getById(id: number) {
    const site = await this.prisma.tech_sites.findUnique({ where: { id } });
    if (!site) throw new NotFoundException('Сайт не найден');
    return site;
  }

  async create(data: CreateTechSiteDTO) {
    const exists = await this.prisma.tech_sites.findUnique({
      where: { url: data.url },
    });
    if (exists)
      throw new ConflictException(
        `Сайт с адресом "${data.url}" уже существует`,
      );
    return await this.prisma.tech_sites.create({
      data: {
        name: data.name,
        url: data.url,
        icon: data.icon ?? 'mdi-web',
        description: data.description,
        sortOrder: data.sortOrder ?? 999,
      },
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return await this.prisma.tech_sites.delete({ where: { id } });
  }
}
