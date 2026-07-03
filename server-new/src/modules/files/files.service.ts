import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFileData } from '../../interfaces/CreateFileData';
import { Prisma } from '@prisma/client';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const files = await this.prisma.files.findMany({
      select: {
        id: true,
        fileName: true,
        originalFileName: true,
        contentType: true,
        sizeBytes: true,
        description: true,
        groupId: true,
      },
    });
    return files;
  }

  async delete(id: string) {
    const file = await this.prisma.files.findUnique({
      where: { id },
    });
    if (!file) {
      throw new NotFoundException('Файл не найден');
    }
    return await this.prisma.files.delete({
      where: { id },
    });
  }

  async create(data: CreateFileData) {
    return await this.prisma.files.create({
      data: data as Prisma.filesCreateInput,
    });
  }

  async downloadById(id: string) {
    const file = await this.prisma.files.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }
}
