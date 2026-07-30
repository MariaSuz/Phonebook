export interface AuditLogData {
  userId: number;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: number | string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
}
