<template>
  <VDataTable
    :key="tableKey"
    :items="items"
    :headers="headers"
    :loading="isLoading"
    :items-per-page="itemsPerPage"
    :search="search"
    :hide-default-footer="hideDefaultFooter"
    :show-expand="showExpand"
    :item-value="itemValue"
    class="app-data-table"
  >
    <template
      v-for="field in highlightableFields"
      :key="field"
      v-slot:[`item.${field}`]="{ item }"
    >
      <slot
        :name="`item.${field}`"
        :item="item"
        :value="item[field]"
      >
        {{ item[field] ?? '—' }}
      </slot>
    </template>
    <template v-slot:item.actions="{ item }">
      <ActionButtons
        v-if="showActions"
        :show-view="showView"
        :can-edit="canEdit"
        :can-delete="canDelete"
        @view="emit('view', item)"
        @edit="emit('edit', item)"
        @delete="emit('delete', item)"
      />
    </template>
    <template v-slot:expanded-row="{ item, columns }">
      <slot
        name="expanded-row"
        :item="item"
        :columns="columns"
      />
    </template>
    <template v-slot:no-data>
      <div class="app-data-table-empty">
        <ButtonComponent
          v-if="noDataButtonTitle"
          prepend-icon="mdi-plus"
          :title="noDataButtonTitle"
          buttonType="save"
          class="app-data-table-empty-btn"
          @click="emit('no-data-action')"
        />
        <span
          v-else-if="noData"
          class="app-data-table-empty-title"
        >
          {{ noData }}
        </span>
      </div>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';

interface TableProps {
  items: any[];
  headers: any[];
  isLoading: boolean;
  tableKey?: string | number;
  itemsPerPage?: number;
  search?: string;
  hideDefaultFooter?: boolean;
  highlightableFields?: string[];
  showActions?: boolean;
  showView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  noData?: string;
  noDataButtonTitle?: string;
  showExpand?: boolean;
  itemValue?: string;
}

const props = withDefaults(defineProps<TableProps>(), {
  tableKey: undefined,
  itemsPerPage: -1,
  hideDefaultFooter: false,
  highlightableFields: () => [],
  showActions: true,
  showView: true,
  canEdit: false,
  canDelete: false,
  showExpand: false,
});
const emit = defineEmits<{
  (e: 'view', item: any): void;
  (e: 'edit', item: any): void;
  (e: 'delete', item: any): void;
  (e: 'no-data-action'): void;
}>();
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.app-data-table {
  border: 1px solid $color-line !important;
  :deep(th) {
    background: rgb(var(--v-theme-background)) !important;
    color: $color-secondary-text !important;
    font-weight: 600 !important;
    font-size: 0.78rem !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid $color-line !important;
  }

  :deep(td) {
    color: $color-primary-text;
    border-bottom: 1px solid $color-line !important;
  }

  :deep(tbody tr:hover) {
    background: $color-bg-muted !important;
    transition: background 0.2s ease;
  }

  :deep(.v-data-table-footer) {
    background: rgb(var(--v-theme-surface));
    border-top: 1px solid $color-line;
  }
}
</style>
