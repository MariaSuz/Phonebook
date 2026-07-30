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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDTO } from './dto/departments-create.dto';
import { UpdateDepartmentDTO } from './dto/departments-update.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditLog } from '../audit/decorators/audit-action.decorator';

@Controller('departments')
@UseInterceptors(AuditInterceptor)
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
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'department', action: 'CREATE' })
  create(@Body() data: CreateDepartmentDTO): Promise<CreateDepartmentDTO> {
    return this.departmentService.create(data);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'department', action: 'UPDATE' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDepartmentDTO,
    @Req() req: any,
  ) {
    req.oldData = await this.departmentService.getById(id);
    return this.departmentService.update(id, data);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'department', action: 'DELETE' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    req.oldData = await this.departmentService.getById(id);
    return this.departmentService.delete(id);
  }
}
