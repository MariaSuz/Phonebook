//Перехватчик роутера
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AuditService } from '../audit.service';
import { AUDIT_KEY, AuditMetadata } from '../decorators/audit-action.decorator';
import { fixEncoding } from '../../../common/utils/encoding.util';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditMetadata>(
      AUDIT_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return next.handle().pipe(
      tap({
        next: (result) => {
          if (metadata) {
            const isFile = metadata.entityType === 'file';
            const isDelete = metadata.action === 'DELETE';
            const oldData = request.oldData;
            this.auditService
              .log({
                userId: user?.userId || 0,
                userName: user?.userName || 'system',
                action: metadata.action,
                entityType: metadata.entityType,
                entityId: result?.id || request.params.id,
                oldData: isFile ? undefined : oldData || undefined,
                newData: isDelete
                  ? undefined
                  : isFile
                    ? {
                        fileName: fixEncoding(
                          result?.fileName || result?.originalFileName,
                        ),
                      }
                    : result || undefined,
              })
              .catch((err) => this.logger.error('Ошибка аудита', err));
          }
        },
        error: (err) => this.logger.error('Ошибка запроса', err),
      }),
    );
  }
}
