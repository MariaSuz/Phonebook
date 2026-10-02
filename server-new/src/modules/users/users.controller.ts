import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ViewUserDTO } from './dto/user-view.dto';
import { CreateUserDTO } from './dto/user-create.dto';
import { UpdateUserDTO } from './dto/users-update.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdminGuard, SelfOrAdminGuard } from '../../guards/roles.guard';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

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
  @UseGuards(JwtAuthGuard, SelfOrAdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
    @Req() req: { user: AuthUser },
  ): Promise<ViewUserDTO> {
    return this.usersService.update(id, data, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  delete(@Param('id', ParseIntPipe) id: number): Promise<ViewUserDTO> {
    return this.usersService.delete(id);
  }
}
