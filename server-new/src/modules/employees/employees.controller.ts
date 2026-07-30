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
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDTO } from './dto/employees-create.dto';
import { UpdateEmployeeDTO } from './dto/employees-update.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditLog } from '../audit/decorators/audit-action.decorator';

@Controller('employees')
@UseInterceptors(AuditInterceptor)
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
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'employee', action: 'CREATE' })
  create(@Body() data: CreateEmployeeDTO) {
    return this.employeesService.create(data);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'employee', action: 'UPDATE' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEmployeeDTO,
    @Req() req: any,
  ) {
    req.oldData = await this.employeesService.getById(id);
    return this.employeesService.update(id, data);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'employee', action: 'DELETE' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    req.oldData = await this.employeesService.getById(id);
    return this.employeesService.delete(id);
  }
}
