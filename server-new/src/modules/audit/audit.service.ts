import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogData } from './interfaces/audit-log.interface';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(data: AuditLogData): Promise<void> {
    const diff = this.computeDiff(data.oldData, data.newData);

    await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        action: data.action,
        entityType: data.entityType,
        entityId: typeof data.entityId === 'string' ? undefined : data.entityId,
        oldData: data.oldData || undefined,
        newData: data.newData || undefined,
        diff: Object.keys(diff).length > 0 ? diff : undefined,
      },
    });
  }

  private computeDiff(
    oldData?: Record<string, any>,
    newData?: Record<string, any>,
  ): Record<string, { old: any; new: any }> {
    if (!oldData || !newData) return {};

    const diff: Record<string, { old: any; new: any }> = {};

    for (const key of Object.keys(newData)) {
      if (oldData[key] !== newData[key]) {
        diff[key] = { old: oldData[key], new: newData[key] };
      }
    }

    return diff;
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }
}
