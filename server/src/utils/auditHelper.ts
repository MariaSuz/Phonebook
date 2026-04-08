import { Request } from 'express';
import { CreateAudit } from '../types/auditType';
import { auditService } from '../services/auditService';

interface AuditLogParams {
  req: Request;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'employee' | 'department' | 'file';
  entityId: number | string;
  oldData?: any | null;
  newData?: any | null;
}

const getUserFromReq = (
  req: Request,
): { userId: number | null; userName: string } => {
  const user = (req as any).user;
  return {
    userId: user?.userId ?? null,
    userName: user?.userName ?? 'system',
  };
};

export const logAction = async (params: AuditLogParams): Promise<void> => {
  const {
    req,
    action,
    entityType,
    entityId,
    oldData,
    newData,
  } = params;

  const { userId, userName } = getUserFromReq(req);

  const auditData: CreateAudit = {
    userId,
    userName,
    action,
    entityType,
    entityId,
    oldData: oldData ?? null,
    newData: newData ?? null,
  };

  await auditService.log(auditData);
};
