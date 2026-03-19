export interface Audit {
  id: number;
  timestamp: Date;
  userId: number | null;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'employee' | 'department' | 'file';
  entityId: number | string;
  oldData?: Record<string, any> | null;
  newData?: Record<string, any> | null;
  diff?: Record<string, any> | null;
}

export type CreateAudit = Omit<Audit, 'id' | 'timestamp'>;