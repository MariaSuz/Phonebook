export interface AuditFormModel {
  id: number;
  timestamp: Date;
  userId: number | null;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';
  entityType: 'employee' | 'department' | 'user' | 'file';
  entityId: number | string;
  oldData?: Record<string, any> | null;
  newData?: Record<string, any> | null;
  diff?: Record<string, any> | null;
}