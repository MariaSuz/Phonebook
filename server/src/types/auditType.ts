export interface Audit {
  id: number;
  timestamp: Date;
  userId: number | null;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'employee' | 'department' | 'file';
  entityId: number | string;
  oldData?: any | null;
  newData?: any | null;
  diff?: any | null;
}

export type CreateAudit = Omit<Audit, 'id' | 'timestamp'>;