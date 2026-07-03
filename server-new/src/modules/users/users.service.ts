import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ViewUserDTO } from './dto/user-view.dto';
import { UserViewMapper } from '../../mappers/user.mapper';
import { UpdateUserDTO } from './dto/users-update.dto';
import { CreateUserDTO } from './dto/user-create.dto';

@Injectable()
export class UsersService {
  private readonly mapper = new UserViewMapper();

  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<ViewUserDTO[]> {
    const data = await this.prisma.users.findMany({});
    return this.mapper.mapMany(data);
  }

  async getById(id: number): Promise<ViewUserDTO> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return this.mapper.mapOne(user);
  }

  async update(id: number, data: UpdateUserDTO): Promise<ViewUserDTO> {
    const user = await this.prisma.users.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        userName: data.userName,
        password: data.password,
        roleId: data.roleId ?? 2,
      },
    });

    return this.mapper.mapOne(updatedUser);
  }

  async create(data: CreateUserDTO): Promise<ViewUserDTO> {
    const user = await this.prisma.users.create({
      data: {
        userName: data.userName,
        password: data.password,
        roleId: data.roleId ?? 2,
      },
    });

    return this.mapper.mapOne(user);
  }

  async delete(id: number): Promise<ViewUserDTO> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    const deletedUser = await this.prisma.users.delete({ where: { id } });
    return this.mapper.mapOne(deletedUser);
  }
}
