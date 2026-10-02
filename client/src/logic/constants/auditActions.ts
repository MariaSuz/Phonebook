export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'Создание',
  UPDATE: 'Изменение',
  DELETE: 'Удаление',
};

export const ACTIONS = (Object.keys(ACTION_LABELS) as AuditAction[]).map((value) => ({
  value,
  label: ACTION_LABELS[value],
}));

export const getActionTitle = (action: AuditAction) => ACTION_LABELS[action];
