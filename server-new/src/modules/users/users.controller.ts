import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ViewUserDTO } from './dto/user-view.dto';
import { CreateUserDTO } from './dto/user-create.dto';
import { UpdateUserDTO } from './dto/users-update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get(): Promise<ViewUserDTO[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<ViewUserDTO> {
    return this.usersService.getById(id);
  }

  @Post()
  create(@Body() data: CreateUserDTO): Promise<ViewUserDTO> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<ViewUserDTO> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<ViewUserDTO> {
    return this.usersService.delete(id);
  }
}
