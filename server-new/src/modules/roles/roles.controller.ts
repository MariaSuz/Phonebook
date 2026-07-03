import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  allRoles() {
    return this.rolesService.getAll();
  }
}
