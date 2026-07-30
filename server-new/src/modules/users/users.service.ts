import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ViewUserDTO } from './dto/user-view.dto';
import { UserViewMapper } from '../../mappers/user.mapper';
import { UpdateUserDTO } from './dto/users-update.dto';
import { CreateUserDTO } from './dto/user-create.dto';
import { HashService } from '../../common/utils/hash.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly mapper = new UserViewMapper();

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

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
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    const exists = await this.prisma.users.findFirst({
      where: { userName: data.userName, id: { not: id } },
    });
    if (exists)
      throw new ConflictException(
        `Пользователь с именем "${data.userName}" уже существует`,
      );

    const updateData: Prisma.usersUpdateInput = {};
    if (data.userName !== undefined) updateData.userName = data.userName;
    if (data.password !== undefined) {
      updateData.password = await this.hashService.hash(data.password);
    }
    if (data.roleId !== undefined) {
      updateData.roles = { connect: { id: data.roleId } };
    }
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateData,
    });

    return this.mapper.mapOne(updatedUser);
  }

  async create(data: CreateUserDTO): Promise<ViewUserDTO> {
    const exists = await this.prisma.users.findUnique({
      where: { userName: data.userName },
    });
    if (exists)
      throw new ConflictException(
        `Пользователь с именем "${data.userName}" уже существует`,
      );
    const hashed = await this.hashService.hash(data.password);
    const user = await this.prisma.users.create({
      data: {
        userName: data.userName,
        password: hashed,
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
