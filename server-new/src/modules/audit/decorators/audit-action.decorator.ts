//Декоратор для интерцептора
import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
  entityType: 'employee' | 'department' | 'file';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
}

export const AuditLog = (metadata: AuditMetadata) =>
  SetMetadata(AUDIT_KEY, metadata);
