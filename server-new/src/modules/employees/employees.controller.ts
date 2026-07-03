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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './dto/employees-create.dto';
import { UpdateEmployeeDTO } from './dto/employees-update.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  allEmployees() {
    return this.employeesService.getAll();
  }
  @Get(':id')
  getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getById(id);
  }
  @Get('department/:departmentId')
  getEmployeesByDepartment(
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    return this.employeesService.getByDepartment(departmentId);
  }
  @Post()
  create(@Body() data: CreateEmployeeDTO) {
    return this.employeesService.create(data);
  }
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDTO,
  ) {
    return this.employeesService.update(id, data);
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.delete(id);
  }
}
