<template>
  <VCard flat>
    <div class="phone-book">
      <div class="phone-book-search">
        <SearchInput
          v-model="searchValue"
          class="phone-book-search-input"
          label="Поиск по сотрудникам и отделам"
          clearable
          :disabled="isDragMode"
        />
        <VBtn
          icon
          variant="text"
          size="small"
          class="phone-book-toggle-all"
          :title="isDragMode ? 'Готово' : 'Режим сортировки отделов'"
          @click="toggleDragMode"
        >
          <VIcon :icon="isDragMode ? 'mdi-check' : 'mdi-pencil-outline'" />
        </VBtn>
        <ButtonComponent
          v-if="isDragMode"
          title="Отмена сортировки"
          buttonType="cancel"
          @click="resetDepartmentsOrder"
        />
        <VBtn
          icon
          variant="text"
          size="small"
          class="phone-book-toggle-all"
          :disabled="isDragMode"
          :title="allCollapsed ? 'Развернуть все' : 'Свернуть все'"
          @click="toggleAll"
        >
          <VIcon :icon="allCollapsed ? 'mdi-unfold-more-horizontal' : 'mdi-unfold-less-horizontal'" />
        </VBtn>
      </div>
      <div
        v-if="isLoading"
        class="phone-book-loader"
      >
        <VProgressCircular
          indeterminate color="#722F37"
          size="64"
         />
        <p class="phone-book-loader-text">Загрузка данных...</p>
      </div>
      <draggable
        v-else
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
      <div
        v-if="!visibleDepartments.length && searchValue"
        class="phone-book-not-found"
      >
        {{ 'Сотрудники или отделы не найдены' }}
      </div>
    </div>
  </VCard>
</template>

<script setup lang="ts">
import SearchInput from '@/components/inputs/SearchInput.vue';
import draggable from 'vuedraggable';
import ButtonComponent from '@/components/ButtonComponent.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useDepartmentStore } from '@/store/departmentsStore';
import DepartmentList from './DepartmentList.vue';
import { useEmployeesStore } from '@/store/employeesStore';
import type { EmployeeFormModel as Employee } from '@/logic/types/forms/EmployeeFormModel';
import type { DepartmentFormModel as Department } from '@/logic/types/forms/DepartmentFormModel';

const searchValue = ref('');
const isDragMode = ref(false);
const departmentStore = useDepartmentStore();
const employeesStore = useEmployeesStore();
const collapsedDepartments = ref<Record<number, boolean>>({});

const isLoading = computed(() => employeesStore.loading);

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
    if (!employees.length) return false;
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
// (не computed с get/set — та версия падала с ошибкой '__draggable_context')
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

onMounted(async () => {
  await departmentStore.getDepartments();
  await employeesStore.getEmployees();
});
</script>

<style lang="scss">
.phone-book {
  &-search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 20px 16px;
  }
  &-search-input {
    flex: 1;
    min-width: 0;
  }
  &-toggle-all {
    color: #722F37 !important;
    flex-shrink: 0;
    background: #FDF5F5 !important;
    box-shadow: 0 2px 6px rgba(114, 47, 55, 0.18) !important;
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(114, 47, 55, 0.28) !important;
    }

    &.v-btn--disabled {
      box-shadow: none !important;
    }
  }
  &-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
  }
  .phone-book-content {
    margin-bottom: 8px;
  }
  .phone-book-ghost {
    opacity: 0.5;
  }
  &-loader-text {
    font-size: 1rem;
    color: #722F37;
    font-weight: 500;
  }
  &-not-found {
    width: 100%;
    font-size: 1.25rem;
    font-weight: 600;
    color: #722F37;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
