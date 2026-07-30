import { Module } from '@nestjs/common';
import { DepartmentsModule } from './modules/departments/departments.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { RolesModule } from './modules/roles/roles.module';
import { FilesModule } from './modules/files/files.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    DepartmentsModule,
    PrismaModule,
    EmployeesModule,
    RolesModule,
    FilesModule,
    UsersModule,
    AuthModule,
    AuditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
