import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Требуется авторизация');
    }

    if (user.roleId !== 1) {
      throw new ForbiddenException('Требуются права администратора');
    }

    return true;
  }
}

@Injectable()
export class SelfOrAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Требуется авторизация');
    }

    if (user.roleId === 1) {
      return true;
    }

    const targetUserId = parseInt(request.params.id, 10);
    if (user.userId === targetUserId) {
      return true;
    }

    throw new ForbiddenException(
      'У вас нет прав для редактирования этого пользователя',
    );
  }
}
