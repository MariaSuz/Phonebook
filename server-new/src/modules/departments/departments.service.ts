import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDTO } from './dto/departments-create.dto';
import { UpdateDepartmentDTO } from './dto/departments-update.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.departments.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getById(id: number) {
    const department = await this.prisma.departments.findUnique({
      where: { id },
    });
    if (!department) throw new NotFoundException('Отдел не найден');
    return department;
  }

  async create(data: CreateDepartmentDTO) {
    const exists = await this.prisma.departments.findUnique({
      where: { name: data.name },
    });
    if (exists)
      throw new ConflictException(
        `Отдел с наименованием "${data.name}" уже существует`,
      );
    return await this.prisma.departments.create({
      data: {
        name: data.name,
        sortOrder: data.sortOrder ?? 999,
      },
    });
  }

  async update(id: number, data: UpdateDepartmentDTO) {
    const department = await this.prisma.departments.findFirst({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Отдел не найден');
    }
    if (data.name) {
      const exists = await this.prisma.departments.findFirst({
        where: { name: data.name, id: { not: id } },
      });
      if (exists)
        throw new ConflictException(
          `Отдел с наименованием "${data.name}" уже существует`,
        );
    }
    return await this.prisma.departments.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  async delete(id: number) {
    const department = await this.prisma.departments.findUnique({
      where: { id },
      include: {
        employees: {
          select: { id: true },
          take: 1,
        },
      },
    });
    if (!department) {
      throw new NotFoundException('Отдел не найден');
    }
    if (department.employees?.length > 0) {
      throw new ConflictException(
        'Невозможно удалить отдел: к нему привязаны сотрудники',
      );
    }
    return await this.prisma.departments.delete({
      where: { id },
    });
  }
}
