import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDTO } from './dto/employees-create.dto';
import { UpdateEmployeeDTO } from './dto/employees-update.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.employees.findMany({
      orderBy: [{ sortOrder: 'asc' }, { fullName: 'asc' }],
    });
  }

  async getById(id: number) {
    const employee = await this.prisma.employees.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Сотрудник не найден');
    return employee;
  }

  async getByDepartment(departmentId: number) {
    return await this.prisma.employees.findMany({
      where: { departmentId },
      orderBy: [{ sortOrder: 'asc' }, { fullName: 'asc' }],
    });
  }

  async create(data: CreateEmployeeDTO) {
    const department = await this.prisma.departments.findUnique({
      where: { id: data.departmentId },
    });
    if (!department) throw new NotFoundException('Отдел не найден');
    return await this.prisma.employees.create({
      data: {
        ...data,
        sortOrder: data.sortOrder ?? 999,
      },
    });
  }

  async update(id: number, data: UpdateEmployeeDTO) {
    const employee = await this.prisma.employees.findFirst({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }
    return await this.prisma.employees.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.cabinet !== undefined && { cabinet: data.cabinet }),
        ...(data.internalPhone !== undefined && {
          internalPhone: data.internalPhone,
        }),
        ...(data.cityPhone !== undefined && { cityPhone: data.cityPhone }),
        ...(data.mobilePhone !== undefined && {
          mobilePhone: data.mobilePhone,
        }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.departmentId !== undefined && {
          departmentId: data.departmentId,
        }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  async delete(id: number) {
    const employee = await this.prisma.employees.findUnique({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException('Сотрудник не найден');
    }
    return await this.prisma.employees.delete({
      where: { id },
    });
  }
}
