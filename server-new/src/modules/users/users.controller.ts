import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ViewUserDTO } from './dto/user-view.dto';
import { CreateUserDTO } from './dto/user-create.dto';
import { UpdateUserDTO } from './dto/users-update.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  get(): Promise<ViewUserDTO[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<ViewUserDTO> {
    return this.usersService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() data: CreateUserDTO): Promise<ViewUserDTO> {
    return this.usersService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ): Promise<ViewUserDTO> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number): Promise<ViewUserDTO> {
    return this.usersService.delete(id);
  }
}
