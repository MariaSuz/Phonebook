<template>
  <VCard>
    <div class="phone-book">
      <div class="phone-book-search">
        <SearchInput
          v-model="searchValue"
          class="phone-book-search-input"
          label="Поиск по сотрудникам и отделам"
          clearable
        />
        <VBtn
          icon
          variant="text"
          size="small"
          class="phone-book-toggle-all"
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
      <div
        v-for="department in visibleDepartments"
        :key="department.id"
        class="phone-book-content"
      >
        <DepartmentList
          :department-id="department.id"
          :search-value="matchesDepartment(department) ? '' : searchValue"
          :match-dep-label="matchesDepartment(department)"
          :collapsed="isCollapsed(department)"
          @update:collapsed="collapsedDepartments[department.id] = $event"
        />
      </div>

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
import { computed, onMounted, ref } from 'vue';
import { useDepartmentStore } from '@/store/departmentsStore';
import DepartmentList from './DepartmentList.vue';
import { useEmployeesStore } from '@/store/employeesStore';
import type { EmployeeFormModel as Employee } from '@/logic/types/forms/EmployeeFormModel';
import type { DepartmentFormModel as Department } from '@/logic/types/forms/DepartmentFormModel';

const searchValue = ref('');
const departmentStore = useDepartmentStore();
const employeesStore = useEmployeesStore();
const isLoading = computed(() => employeesStore.loading);
const collapsedDepartments = ref<Record<number, boolean>>({});

const searchTerm = computed(() => searchValue.value.trim().toLowerCase());
const hasSearch = computed(() => searchTerm.value.length > 0);

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
  return departmentStore.list.filter(department => {
    const employees = employeesStore.filterEmployeesByDepartment(department.id) || [];
    if (!employees.length) return false;
    if (!hasSearch.value) return true;

    return (
      matchesDepartment(department) ||
      employees.some(employee => matchesEmployee(employee, searchTerm.value))
    );
  });
});

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
