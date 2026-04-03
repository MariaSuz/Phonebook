<template>
  <VCard class="files__tabs">
    <VTabs
      :model-value="activeTab"
      @update:model-value="$emit('update:activeTab', $event)"
      align-tabs="center"
    >
      <VTab
        v-for="group in groupOptions"
        :key="group.value"
        :value="group.value"
      >
        {{ group.title }}
      </VTab>
    </VTabs>
  </VCard>
</template>

<script setup lang="ts">

interface fileProps {
  activeTab: number;
}
const props = defineProps<fileProps>();
  defineEmits<{
  (e: 'update:activeTab', value: string | number): void;
}>();

const groupOptions = [
  { title: 'Техническое обслуживание', value: 1 },
  { title: 'Нормативно-Правовые документы', value: 2 },
  { title: 'Методические рекомендации по Противодествию коррупции', value: 3 },
];
</script>
<style scoped lang="scss">
.files__tabs {
  .v-tab {
    text-transform: none;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.3px;
    color: #8B4C39;
    min-height: 48px;
    transition: all 0.2s ease;
    &:hover {
      color: #722F37;
      background: rgba(178, 34, 34, 0.05);
    }
    &--selected {
      color: #722F37 !important;
      font-weight: 600;
    }
  }
}
</style>
