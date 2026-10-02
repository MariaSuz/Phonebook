import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.userId },
      select: { id: true, userName: true, roleId: true },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    return {
      userId: user.id,
      userName: user.userName,
      roleId: user.roleId,
    };
  }
}
