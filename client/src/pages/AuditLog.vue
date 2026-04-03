<template>
  <VCard>
    <div class="audit">
      <div class="audit__header">
        <span class="audit-title">Журнал действий</span>
      </div>
      <div class="audit-search">
        <SearchInput
          v-model="searchValue"
          label="Поиск записи"
          clearable
        />
      </div>
        <VDataTable
          :key="auditList.id"
          :headers="headers"
          :items="auditList"
          :search="searchValue"
          :items-per-page="10"
          class="audit__table"
        >
        <template v-slot:item.timestamp="{ item }">
          {{ formatDate(item.timestamp) }}
        </template>
          <template v-slot:item.action="{ item }">
            <VChip
              :color="getActionColor(item.action)"
              size="small"
              class="font-weight-bold"
            >
              {{ getActionTitle(item.action) }}
            </VChip>
          </template>
        </VDataTable>
      </div>
  </VCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SearchInput from '@/components/inputs/SearchInput.vue';
import { useAuditLogStore } from '@/store/auditStore';


const auditStore = useAuditLogStore();
const searchValue = ref('');

const headers = computed(() => [
  { key: 'timestamp', title: 'Дата', sortable: true },
  { key: 'userId', title: 'Id пользователя', sortable: true },
  { key: 'userName', title: 'Имя пользователя', sortable: true },
  {
    title: 'Действия',
    key: 'action',
    sortable: true,
  },
  { key: 'entityType', title: 'Объект изменения', sortable: true },
  { key: 'entityId', title: 'Id объекта', sortable: true },
  { key: 'diff', title: 'Изменения' },
  { key: 'newData', title: 'Новые данные' },
  { key: 'oldData', title: 'Старые данные' },
]);

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'success';
    case 'UPDATE':
      return 'warning';
    default:
      return 'error';
  }
};
const getActionTitle = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'Создание';
    case 'UPDATE':
      return 'Изменение';
    default:
      return 'Удаление';
  }
};

const formatDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU')
}

const auditList = computed(() => auditStore.list);
onMounted(async () => {
  await auditStore.getlogs();
});
</script>

<style lang="scss" scoped>
.audit {
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #FDF5F5, #FCE9E9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  &-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #722F37;
    margin: 0 0 4px 0;
  }

  &__table {
    background: transparent !important;
    :deep(tbody tr:hover) {
      background: #FDF5F5 !important;
      transition: background 0.2s ease;
    }
    :deep(.v-data-table-footer) {
      background: #FDF5F5;
    }
  }
}
</style>