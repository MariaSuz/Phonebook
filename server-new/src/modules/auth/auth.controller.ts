import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AccessDTO } from './dto/access.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: AuthDTO): Promise<AccessDTO> {
    return this.authService.login(data);
  }
}
