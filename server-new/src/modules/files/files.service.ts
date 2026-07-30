import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateFileData } from './interfaces/create-file-data.interface';
import { fixEncoding } from '../../common/utils/encoding.util';

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
    return files.map((file) => ({
      ...file,
      fileName: fixEncoding(file.fileName),
      originalFileName: fixEncoding(file.originalFileName),
    }));
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
    const file = await this.prisma.files.create({
      data: data as Prisma.filesCreateInput,
    });
    return {
      ...file,
      fileName: fixEncoding(file.fileName),
      originalFileName: fixEncoding(file.originalFileName),
    };
  }

  async downloadById(id: string) {
    const file = await this.prisma.files.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }

  async getById(id: string) {
    const file = await this.prisma.files.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }
}
