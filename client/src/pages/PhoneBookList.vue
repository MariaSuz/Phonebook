<template>
  <div class="phone-book">
    <div class="phone-book-header">
      <h1 class="phone-book-header-title font-heading">Телефонный справочник</h1>
      <div class="phone-book-header-actions">
        <ButtonComponent
          prepend-icon="mdi-sort"
          title="Порядок отделов"
          :active="isDragMode"
          :chip="isDragMode ? 'ВКЛ' : undefined"
          buttonType="cancel"
          @click="toggleDragMode"
        />
        <ButtonComponent
          v-if="authenticationUser"
          :disabled="isDragMode"
          prepend-icon="mdi-plus"
          title="Добавить подразделение"
          buttonType="save"
          @click="addDepartment"
        />
      </div>
    </div>
    <div class="phone-book-search">
      <SearchInput
        v-model="searchValue"
        label="Поиск по сотрудникам и отделам"
        clearable
        :disabled="isDragMode"
      />
      <ButtonComponent
        :prepend-icon="allCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal'"
        :title="allCollapsed ? 'Развернуть все' : 'Свернуть все'"
        buttonType="save"
        :disabled="isDragMode"
        @click="toggleAll"
      />
    </div>
    <div
      v-if="isDragMode"
      class="phone-book-drag-hint"
    >
      <span>Тяните за шапку отдела, чтобы изменить порядок. Новый порядок сохраняется сразу.</span>
      <ButtonComponent
        title="Сбросить сортировку"
        buttonType="cancel"
        @click="resetDepartmentsOrder"
      />
      <ButtonComponent
        title="Готово"
        buttonType="cancel"
        @click="toggleDragMode"
      />
    </div>
    <PhoneBookSkeleton v-if="isLoading"/>
    <div
      v-else
      class="phone-book-list"
    >
      <draggable
        v-model="orderedDepartments"
        item-key="id"
        tag="div"
        :animation="200"
        handle=".departments-table-header"
        :disabled="!isDragMode"
        ghost-class="phone-book-ghost"
        @change="onDepartmentsReordered"
      >
        <template #item="{ element: department }">
          <div class="phone-book-content">
            <DepartmentList
              :department-id="department.id"
              :search-value="matchesDepartment(department) ? '' : searchValue"
              :search-query="searchValue"
              :collapsed="isCollapsed(department)"
              :sort-mode="isDragMode"
              @update:collapsed="collapsedDepartments[department.id] = $event"
            />
          </div>
        </template>
      </draggable>
    </div>
    <div
      v-if="!visibleDepartments.length && searchValue"
      class="phone-book-not-found"
    >
      {{ 'Сотрудники или отделы не найдены' }}
    </div>
    <FormModal
      v-model="isShowModalAddDepartment"
      :form-component="DepartmentForm"
      :form-type="FormTypes.ADD"
      width="520"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import SearchInput from '@/components/inputs/SearchInput.vue';
import draggable from 'vuedraggable';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDepartmentStore } from '@/store/departmentsStore';
import DepartmentList from './DepartmentList.vue';
import { useEmployeesStore } from '@/store/employeesStore';
import type { EmployeeFormModel as Employee } from '@/logic/types/forms/EmployeeFormModel';
import type { DepartmentFormModel as Department } from '@/logic/types/forms/DepartmentFormModel';
import { useAuthStore } from '@/store/authStore';
import FormModal from '@/components/modals/FormModal.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import DepartmentForm from '@/components/forms/DepartmentForm.vue';
import PhoneBookSkeleton from '@/components/PhoneBookSkeleton.vue';

const route = useRoute();
const searchValue = ref('');
const isDragMode = ref(false);
const departmentStore = useDepartmentStore();
const employeesStore = useEmployeesStore();
const authStore = useAuthStore();
const collapsedDepartments = ref<Record<number, boolean>>({});
const isShowModalAddDepartment = ref(false);

const isLoading = computed(() => employeesStore.loading);
const authenticationUser = computed(() => authStore.isAuthenticated);

const searchTerm = computed(() => searchValue.value.trim().toLowerCase());
const hasSearch = computed(() => searchTerm.value.length > 0);

//Поиск
const matchesDepartment = (department: Department) => {
  if (!hasSearch.value) return false;
  return department.name.toLowerCase().includes(searchTerm.value);
};

const matchesEmployee = (employee: Employee, term: string) => {
  const fields = [
    employee.cabinet,
    employee.fullName,
    employee.position,
    employee.email,
    employee.cityPhone,
    employee.mobilePhone,
    employee.internalPhone,
  ];

  return fields.some(field => String(field ?? '').toLowerCase().includes(term));
};

const visibleDepartments = computed(() => {
  return departmentStore.orderedList.filter(department => {
    const employees = employeesStore.filterEmployeesByDepartment(department.id) || [];
    if (!hasSearch.value) return true;

    return (
      matchesDepartment(department) ||
      employees.some(employee => matchesEmployee(employee, searchTerm.value))
    );
  });
});

//Сворачивание
const isCollapsed = (department: Department) =>
  collapsedDepartments.value[department.id] ?? false;

const setAllCollapsed = (value: boolean) => {
  const updated: Record<number, boolean> = {};
  for (const department of visibleDepartments.value) {
    updated[department.id] = value;
  }
  collapsedDepartments.value = updated;
};

const collapseAll = () => setAllCollapsed(true);
const expandAll = () => setAllCollapsed(false);

const allCollapsed = computed(() =>
  visibleDepartments.value.length > 0 &&
  visibleDepartments.value.every(department => isCollapsed(department))
);

const toggleAll = () => {
  if (allCollapsed.value) {
    expandAll();
  } else {
    collapseAll();
  }
};

//Сортировка — обычный ref, синхронизируется из visibleDepartments через watch
const orderedDepartments = ref<Department[]>([]);

watch(visibleDepartments, (list) => {
  orderedDepartments.value = [...list];
}, { immediate: true });

const onDepartmentsReordered = () => {
  departmentStore.updateDepartmentsOrder(orderedDepartments.value);
};

const toggleDragMode = () => {
  if (isDragMode.value) {
    isDragMode.value = false;
    return;
  }
  searchValue.value = '';
  isDragMode.value = true;
};

const resetDepartmentsOrder = () => {
  departmentStore.resetDepartmentsOrder();
  isDragMode.value = false;
};

//отделы
const closeModal = () => {
  isShowModalAddDepartment.value = false;
};
const addDepartment = () => {
  isShowModalAddDepartment.value = true;
};

onMounted(async () => {
  await departmentStore.getDepartments();
  await employeesStore.getEmployees();
});
</script>

<style lang="scss">
@import '@/styles/colors';

.phone-book {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    &-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
  }

  &-header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
    border-radius: 4px;
  }

  &-drag-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    margin-bottom: 8px;
    background: $color-bg-muted;
    border-radius: 4px;
    color: $color-secondary-text;
    font-size: 0.85rem;

    span {
      flex: 1;
    }
  }
  &-toggle-all {
    color: rgb(var(--v-theme-primary)) !important;
    flex-shrink: 0;
    background: $color-bg-muted !important;
    box-shadow: none !important;
    transition: transform 0.15s ease;

    &:hover {
      transform: translateY(-1px);
    }

    &.v-btn--disabled {
      box-shadow: none !important;
    }
  }
  .phone-book-content {
    margin-bottom: 8px;
  }
  .phone-book-ghost {
    opacity: 0.5;
  }
  &-loader-text {
    font-size: 1rem;
    color: rgb(var(--v-theme-primary));
    font-weight: 500;
  }
  &-not-found {
    width: 100%;
    font-size: 1.25rem;
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
