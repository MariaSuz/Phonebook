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
      :is-loading="auditStore.loading"
      :meta="auditStore.meta"
      :highlightable-fields="['timestamp', 'action', 'entity', 'summary']"
      :show-actions="false"
      show-expand
      item-value="id"
      @update:page="loadPage"
    >
      <template v-slot:item.timestamp="{ item }">
        <div class="audit__when">
          <span class="audit__when-date">{{ formatDate(item.timestamp) }}</span>
          <span class="audit__when-time">{{ formatTime(item.timestamp) }}</span>
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
        <span class="audit__summary">{{ getSummary(item) }}</span>
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
import { ACTIONS, getActionTitle, type AuditAction } from '@/logic/constants/auditActions';
import {
  getChangeSummary,
  getEntityLabel,
  getExpandedJson,
} from '@/logic/utils/auditFormatters';
import { formatDate, formatTime } from '@/logic/utils/dateUtils';

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

const loadPage = (page: number) => {
  fetchWithFilters((page - 1) * auditStore.meta.limit);
};

const headers = [
  { key: 'timestamp', title: 'Когда', width: '130px' },
  { key: 'action', title: 'Действие', width: '150px' },
  { key: 'userName', title: 'Пользователь' },
  { key: 'entity', title: 'Объект', sortable: false },
  { key: 'summary', title: 'Что изменилось', sortable: false },
];

const departmentName = (id: number) => departmentStore.list.find((d) => d.id === id)?.name;
const getSummary = (item: AuditFormModel) => getChangeSummary(item, departmentName);

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
}
</style>
