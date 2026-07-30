import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../common/utils/hash.service';
import { AccessDTO } from './dto/access.dto';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: AuthDTO): Promise<AccessDTO> {
    const user = await this.prisma.users.findUnique({
      where: { userName: data.userName },
    });
    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const match = await this.hashService.compare(data.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const payload = {
      userId: user.id,
      userName: user.userName,
      roleId: user.roleId,
    };

    return {
      id: user.id,
      userName: user.userName,
      roleId: user.roleId,
      token: this.jwtService.sign(payload),
    };
  }
}
