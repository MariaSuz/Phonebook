import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogData } from './interfaces/audit-log.interface';
import { AuditQueryDTO } from './dto/audit-query.dto';
import { Prisma } from '@prisma/client';

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

  async findAll(query: AuditQueryDTO) {
    const { limit = 25, offset = 0, action, month } = query;

    const where: Prisma.auditLogWhereInput = {
      ...(action !== undefined && { action }),
      ...(month !== undefined && {
        timestamp: {
          gte: this.monthStart(month),
          lt: this.monthEnd(month),
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        limit,
        offset,
        total,
        hasMore: offset + data.length < total,
      },
    };
  }

  //для фильтрации по месяцам
  private monthStart(month: string): Date {
    const [year, m] = month.split('-').map(Number);
    return new Date(Date.UTC(year, m - 1, 1));
  }

  private monthEnd(month: string): Date {
    const [year, m] = month.split('-').map(Number);
    return new Date(Date.UTC(year, m, 1));
  }
}
