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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDTO } from './dto/departments-create.dto';
import { UpdateDepartmentDTO } from './dto/departments-update.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Get()
  allDepartments() {
    return this.departmentService.getAll();
  }
  @Get(':id')
  getDepartmentById(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.getById(id);
  }
  @Post()
  create(@Body() data: CreateDepartmentDTO): Promise<CreateDepartmentDTO> {
    return this.departmentService.create(data);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDepartmentDTO,
  ) {
    return this.departmentService.update(id, data);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.delete(id);
  }
}
