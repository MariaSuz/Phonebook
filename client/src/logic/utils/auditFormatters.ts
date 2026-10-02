import type { AuditFormModel } from '@/logic/types/forms/AuditFormModel';
import { getRoleName } from '@/logic/constants/roles';

type DepartmentNameResolver = (id: number) => string | undefined;

export const ENTITY_LABELS: Record<string, string> = {
  employee: 'Сотрудник',
  department: 'Отдел',
  file: 'Документ',
  user: 'Пользователь',
};

export const FIELD_LABELS: Record<string, Record<string, string>> = {
  employee: {
    fullName: 'ФИО',
    position: 'Должность',
    cabinet: 'Кабинет',
    internalPhone: 'Внутренний номер',
    cityPhone: 'Городской номер',
    mobilePhone: 'Сотовый номер',
    email: 'Почта',
    departmentId: 'Отдел',
    sortOrder: 'Порядок сортировки',
  },
  department: {
    name: 'Название',
    sortOrder: 'Порядок сортировки',
  },
  file: {
    fileName: 'Имя файла',
    originalFileName: 'Оригинальное имя файла',
    description: 'Описание',
    contentType: 'Тип файла',
    sizeBytes: 'Размер',
    groupId: 'Группа',
  },
  user: {
    userName: 'Логин',
    roleId: 'Роль',
  },
};

export const getEntityLabel = (entityType: string) =>
  ENTITY_LABELS[entityType] ?? entityType;
const getFieldLabel = (entityType: string, key: string) =>
  FIELD_LABELS[entityType]?.[key] ?? key;

const formatFieldValue = (
  entityType: string,
  key: string,
  value: any,
  departmentName?: DepartmentNameResolver,
) => {
  if (value === null || value === undefined || value === '') return '—';
  if (entityType === 'user' && key === 'roleId') {
    return getRoleName(value) ?? String(value);
  }
  if (entityType === 'employee' && key === 'departmentId') {
    return departmentName?.(value) ?? String(value);
  }
  return String(value);
};

const getDiffEntries = (item: AuditFormModel, departmentName?: DepartmentNameResolver) => {
  if (!item.diff) return [];
  return Object.entries(item.diff).map(([key, value]) => ({
    key,
    label: getFieldLabel(item.entityType, key),
    oldDisplay: formatFieldValue(item.entityType, key, (value as any)?.old, departmentName),
    newDisplay: formatFieldValue(item.entityType, key, (value as any)?.new, departmentName),
  }));
};

const getEntitySummary = (
  item: AuditFormModel,
  data?: Record<string, any> | null,
) => {
  if (!data) return '—';
  switch (item.entityType) {
    case 'employee':
      return [data.fullName, data.position].filter(Boolean).join(', ') || '—';
    case 'department':
      return data.name ?? '—';
    case 'file':
      return data.originalFileName ?? data.fileName ?? '—';
    case 'user':
      return data.userName ?? '—';
    default:
      return '—';
  }
};

export const getChangeSummary = (item: AuditFormModel, departmentName?: DepartmentNameResolver) => {
  if (item.action === 'UPDATE') {
    const entries = getDiffEntries(item, departmentName);
    if (!entries.length) return '—';
    if (entries.length === 1) {
      return `${entries[0].label}: ${entries[0].oldDisplay} → ${entries[0].newDisplay}`;
    }
    return entries.map((entry) => entry.label).join(', ');
  }
  if (item.action === 'CREATE') return getEntitySummary(item, item.newData);
  if (item.action === 'DELETE') return '';
  return '—';
};

export const getExpandedJson = (item: AuditFormModel) => {
  const payload =
    item.action === 'DELETE'
      ? item.oldData
      : item.action === 'CREATE'
        ? item.newData
        : { old: item.oldData, new: item.newData, diff: item.diff };
  return JSON.stringify(payload ?? {}, null, 2);
};