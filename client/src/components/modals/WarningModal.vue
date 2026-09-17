<template>
  <Modal
    v-model="show"
    class="warning-modal"
    max-width="440"
    @close="close"
  >
    <div class="warning-modal__body">
      <div class="warning-modal__icon">
        <VIcon
          icon="mdi-exclamation"
          size="32"
          color="white"
        />
      </div>
      <h3 class="warning-modal__title font-heading">Отдел нельзя удалить</h3>
      <p class="warning-modal__message">
        В отделе <strong>{{ departmentName }}</strong> ещё {{ employeeCountLabel }}.
        Удалите их или переведите в другой отдел, а затем повторите удаление.
      </p>
      <div
        v-if="employees.length"
        class="warning-modal__list"
      >
        <div class="warning-modal__list-header">
          <span>Сотрудники отдела</span>
          <span>{{ employees.length }}</span>
        </div>
        <div
          v-for="employee in visibleEmployees"
          :key="employee.id"
          class="warning-modal__list-item"
        >
          <span class="warning-modal__list-name">{{ employee.fullName }}</span>
          <span class="warning-modal__list-position">{{ employee.position }}</span>
          <span class="warning-modal__list-cabinet">{{ employee.cabinet }}</span>
        </div>
        <div
          v-if="remainingCount > 0"
          class="warning-modal__list-more"
        >
          и ещё {{ remainingCount }} сотрудников
        </div>
      </div>
    </div>
    <template #footer>
      <div class="warning-modal__footer">
        <ButtonComponent
          title="Закрыть"
          buttonType="cancel"
          @click="close"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import Modal from '@/components/modals/Modal.vue';
import { pluralizeRu } from '@/logic/utils/pluralize';

interface EmployeePreview {
  id: number;
  fullName: string;
  position?: string;
  cabinet?: string;
}

interface WarningModalProps {
  modelValue?: boolean;
  departmentName?: string;
  departmentId?: number;
  employees?: EmployeePreview[];
}

interface WarningModalEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancel'): void;
  (e: 'open-department'): void;
}

const props = withDefaults(defineProps<WarningModalProps>(), {
  employees: () => [],
});
const emits = defineEmits<WarningModalEmits>();

const show = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

const VISIBLE_LIMIT = 3;
const visibleEmployees = computed(() => props.employees.slice(0, VISIBLE_LIMIT));
const remainingCount = computed(() => props.employees.length - VISIBLE_LIMIT);

const employeeCountLabel = computed(() => {
  const count = props.employees.length;
  return `${count} ${pluralizeRu(count, ['сотрудник', 'сотрудника', 'сотрудников'])}`;
});

const close = () => {
  show.value = false;
  emits('cancel');
};

const openDepartment = () => {
  close();
  emits('open-department');
};
</script>
<style lang="scss">
@import '@/styles/colors';

.warning-modal {
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 28px 32px 24px;
  }

  &__icon {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  &__title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary-text;
  }

  &__message {
    margin: 4px 0 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: $color-primary-text;

    strong {
      font-weight: 700;
    }
  }

  &__list {
    width: 100%;
    margin-top: 12px;
    padding: 12px 16px;
    background: $color-bg-muted;
    border-radius: 4px;
    text-align: left;
  }

  &__list-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $color-secondary-text;
    margin-bottom: 8px;
  }

  &__list-item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.85rem;
    color: $color-primary-text;
    padding: 4px 0;
  }

  &__list-position {
    flex: 1;
    color: $color-secondary-text;
    text-align: left;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__list-cabinet {
    color: $color-secondary-text;
  }

  &__list-more {
    font-size: 0.8rem;
    color: $color-muted;
    padding-top: 6px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 20px 24px 24px;
    border-top: 1px solid $color-line;
  }
}
</style>
