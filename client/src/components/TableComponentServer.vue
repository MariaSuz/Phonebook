<template>
  <VDataTableServer
    :items="items"
    :headers="headers"
    :loading="isLoading"
    :items-length="meta.total"
    :items-per-page="meta.limit"
    :items-per-page-options="[meta.limit]"
    :page="currentPage"
    :show-expand="showExpand"
    :item-value="itemValue"
    class="app-data-table"
    @update:page="onPageChange"
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
  </VDataTableServer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';

export interface TableMeta {
  limit: number;
  offset: number;
  total: number;
}

interface TableServerProps {
  items: any[];
  headers: any[];
  isLoading: boolean;
  meta: TableMeta;
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

const props = withDefaults(defineProps<TableServerProps>(), {
  highlightableFields: () => [],
  showActions: true,
  showView: true,
  canEdit: false,
  canDelete: false,
  showExpand: false,
  itemValue: 'id',
});

const emit = defineEmits<{
  (e: 'view', item: any): void;
  (e: 'edit', item: any): void;
  (e: 'delete', item: any): void;
  (e: 'no-data-action'): void;
  (e: 'update:page', page: number): void;
}>();

const currentPage = computed(() =>
  props.meta.limit > 0 ? Math.floor(props.meta.offset / props.meta.limit) + 1 : 1,
);

const onPageChange = (page: number) => emit('update:page', page);
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