<template>
  <VCard>
    <div class="phone-book">
      <div class="phone-book-search">
        <SearchInput
          v-model="searchValue"
          label="Поиск по сотрудникам"
          clearable
        />
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
        v-for="department in departmentsWithUsers"
        :key="department.id"
        class="phone-book-content"
      >
        <DepartmentList
          :department-id="department.id"
          :search-value="searchValue"
        />
      </div>

      <div
        v-if="!departmentsWithUsers.length && searchValue"
        class="phone-book-not-found"
      >
        {{ 'Сотрудники не найдены' }}
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

const searchValue = ref('');
const departmentStore = useDepartmentStore();
const employeesStore = useEmployeesStore();
const isLoading = computed(() => employeesStore.loading);

const departmentsWithUsers = computed(() => {
  return departmentStore.list.filter(department => {
    const employees = employeesStore.filterEmployeesByDepartment(department.id) || [];
    if (!employees.length) return false;
    if (searchValue.value && searchValue.value.trim()) {
      const searchTerm = searchValue.value.toLowerCase().trim();
      return employees.some(employee =>
        employee.cabinet?.toLowerCase().includes(searchTerm) ||
        employee.fullName?.toLowerCase().includes(searchTerm) ||
        employee.position?.toLowerCase().includes(searchTerm) ||
        employee.email?.toLowerCase().includes(searchTerm) ||
        employee.cityPhone?.toLowerCase().includes(searchTerm) ||
        employee.mobilePhone?.toLowerCase().includes(searchTerm) ||
        employee.internalPhone?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
});

onMounted(async () => {
  await departmentStore.getDepartments();
  await employeesStore.getEmployees();
});
</script>

<style lang="scss">
.phone-book {
  &-search {
    padding: 20px 20px 16px;
  }
  &-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 16px;
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
