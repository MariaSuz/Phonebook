import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CommonModule } from '../../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/roles.guard';

@Module({
  controllers: [AuthController],
  imports: [
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard],
  exports: [JwtAuthGuard, AdminGuard],
})
export class AuthModule {}
