<template>
  <div class="audit">
    <Breadcrumbs current="Журнал аудита" />
    <div class="audit__header">
      <h1 class="audit__title font-heading">Журнал аудита</h1>
    </div>
    <div class="audit__filters">
      <span class="audit__filters-label">Фильтры:</span>
      <VBtnToggle
        v-model="selectedAction"
        class="audit__filters-toggle"
      >
        <VBtn
          v-for="item in ACTIONS"
          :key="item.value"
          :value="item.value"
          size="small"
          class="audit__filters-toggle-buttons"
        >
          {{ item.label }}
        </VBtn>
      </VBtnToggle>
      <VueDatePicker
        v-model="selectedMonthValue"
        month-picker
        :locale="ru"
        :clearable="true"
        placeholder="Все месяцы"
      />
    </div>
    <TableComponentServer
      :items="auditStore.list"
      :headers="headers"
      :is-loading="isLoading"
      :meta="auditStore.meta"
      :highlightable-fields="['timestamp', 'action', 'entity', 'summary']"
      :show-actions="false"
      show-expand
      item-value="id"
      @update:page="loadPage"
    >
      <template v-slot:item.timestamp="{ item }">
        <div class="audit__when">
          <span class="audit__when-date">{{ formatDateOnly(item.timestamp) }}</span>
          <span class="audit__when-time">{{ formatTimeOnly(item.timestamp) }}</span>
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <VChip
          size="small"
          variant="outlined"
          class="action-chip"
          :class="`action-chip--${item.action.toLowerCase()}`"
        >
          {{ getActionTitle(item.action) }}
        </VChip>
      </template>
      <template v-slot:item.entity="{ item }">
        {{ getEntityLabel(item.entityType) }}&nbsp;
      </template>
      <template v-slot:item.summary="{ item }">
        <span class="audit__summary">{{ getChangeSummary(item) }}</span>
      </template>
      <template v-slot:expanded-row="{ item, columns }">
        <tr>
          <td :colspan="columns.length" class="audit__expanded">
            <pre class="audit__json">{{ getExpandedJson(item) }}</pre>
          </td>
        </tr>
      </template>
    </TableComponentServer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ru } from 'date-fns/locale';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';
import TableComponentServer from '@/components/TableComponentServer.vue';
import { useAuditLogStore } from '@/store/auditStore';
import { useDepartmentStore } from '@/store/departmentsStore';
import type { AuditFormModel } from '@/logic/types/forms/AuditFormModel';

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

const auditStore = useAuditLogStore();
const departmentStore = useDepartmentStore();

const selectedAction = ref<AuditAction | null>(null);
const selectedMonthValue = ref<{ month: number; year: number } | null>(null);

// строка "YYYY-MM" для запроса на бэкенд
const selectedMonth = computed<string | null>(() => {
  if (!selectedMonthValue.value) return null;
  const { month, year } = selectedMonthValue.value;
  return `${year}-${String(month + 1).padStart(2, '0')}`;
});

const isLoading = computed(() => auditStore.loading);

//пагинация
const loadPage = (page: number) => {
  const offset = (page - 1) * auditStore.meta.limit;
  auditStore.getlogs({ offset });
};

const ACTIONS: Array<{ value: AuditAction; label: string }> = [
  { value: 'CREATE', label: 'Создание' },
  { value: 'UPDATE', label: 'Изменение' },
  { value: 'DELETE', label: 'Удаление' },
];

const headers = [
  { key: 'timestamp', title: 'Когда', width: '130px' },
  { key: 'action', title: 'Действие', width: '150px' },
  { key: 'userName', title: 'Пользователь' },
  { key: 'entity', title: 'Объект', sortable: false },
  { key: 'summary', title: 'Что изменилось', sortable: false },
];

const ENTITY_LABELS: Record<string, string> = {
  employee: 'Сотрудник',
  department: 'Отдел',
  file: 'Документ',
  user: 'Пользователь',
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
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

const getEntityLabel = (entityType: string) => ENTITY_LABELS[entityType] ?? entityType;
const getFieldLabel = (entityType: string, key: string) => FIELD_LABELS[entityType]?.[key] ?? key;

const formatFieldValue = (entityType: string, key: string, value: any) => {
  if (value === null || value === undefined || value === '') return '—';
  if (entityType === 'user' && key === 'roleId') {
    return value === 1 ? 'Администратор' : value === 2 ? 'Редактор' : String(value);
  }
  if (entityType === 'employee' && key === 'departmentId') {
    const department = departmentStore.list.find((d) => d.id === value);
    return department?.name ?? String(value);
  }
  return String(value);
};

const getDiffEntries = (item: AuditFormModel) => {
  if (!item.diff) return [];
  return Object.entries(item.diff).map(([key, value]) => ({
    key,
    label: getFieldLabel(item.entityType, key),
    oldDisplay: formatFieldValue(item.entityType, key, (value as any)?.old),
    newDisplay: formatFieldValue(item.entityType, key, (value as any)?.new),
  }));
};

const getEntitySummary = (item: AuditFormModel, data?: Record<string, any> | null) => {
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

const getChangeSummary = (item: AuditFormModel) => {
  if (item.action === 'UPDATE') {
    const entries = getDiffEntries(item);
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

const getActionTitle = (action: string) => {
  switch (action) {
    case 'CREATE': return 'Создание';
    case 'UPDATE': return 'Изменение';
    case 'LOGIN': return 'Вход';
    default: return 'Удаление';
  }
};

const formatDateOnly = (timestamp: Date) => new Date(timestamp).toLocaleDateString('ru-RU');
const formatTimeOnly = (timestamp: Date) => new Date(timestamp).toLocaleTimeString('ru-RU');

const getExpandedJson = (item: AuditFormModel) => {
  const payload = item.action === 'DELETE'
    ? item.oldData
    : item.action === 'CREATE'
      ? item.newData
      : { old: item.oldData, new: item.newData, diff: item.diff };
  return JSON.stringify(payload ?? {}, null, 2);
};

const fetchWithFilters = (offset = 0) => {
  auditStore.getlogs({
    offset,
    action: selectedAction.value ?? undefined,
    month: selectedMonth.value ?? undefined,
  });
};

watch([selectedAction, selectedMonthValue], () => {
  fetchWithFilters();
});

onMounted(async () => {
  await auditStore.getlogs();
  if (!departmentStore.list.length) {
    await departmentStore.getDepartments();
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.audit {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__when {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__when-date {
    font-weight: 600;
    color: $color-primary-text;
    font-size: 0.88rem;
  }

  &__when-time {
    font-size: 0.78rem;
    color: $color-muted;
  }

  &__entity-id {
    color: $color-secondary-text;
  }

  &__summary {
    color: $color-primary-text;
  }

  &__expanded {
    background: $color-bg-muted;
    padding: 12px 16px !important;
  }

  &__json {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: $color-primary-text;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 320px;
    overflow: auto;
  }

  &__filters {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border: 1px solid $color-line;
    margin-bottom: 16px;
    background: rgb(var(--v-theme-surface));
    &-label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: $color-secondary-text;
    }
    &-toggle {
      display: flex;
      gap: 10px;
      &-buttons {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: $color-secondary-text;
        border: 1px solid $color-line !important;
        border-radius: 0 !important;
        &.v-btn--active {
          border-color: rgb(var(--v-theme-primary)) !important;
          color: rgb(var(--v-theme-primary));
        }
      }
    }
  }
}

.action-chip {
  font-weight: 700 !important;
  letter-spacing: 0.02em;
  border-color: $color-line !important;
  color: $color-primary-text !important;

  &--update {
    border-color: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-primary)) !important;
  }

  &--delete {
    border-color: rgb(var(--v-theme-error)) !important;
    color: rgb(var(--v-theme-error)) !important;
  }

  &--login {
    border-color: $color-line !important;
    color: $color-muted !important;
  }
}
</style>
