<template>
  <VCard>
    <div class="phone-book">
      <div class="phone-book-search">
        <SearchInput
          v-model="searchValue"
          label="Поиск сотрудника"
          clearable
        />
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
      <div v-if="!departmentsWithUsers.length" class="phone-book-not-found">
        {{ searchValue ? 'Сотрудники не найдены' : 'Нет доступных отделов с сотрудниками' }}
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
const userStore = useEmployeesStore();

const departmentsWithUsers = computed(() => {
  return departmentStore.list.filter(department => {
    const users = userStore.employeesByDepartment.get(department.id) || [];
    if (!users.length) return false;
    if (searchValue.value.trim()) {
      const searchTerm = searchValue.value.toLowerCase().trim();
      return users.some(user =>
        user.cabinet?.toLowerCase().includes(searchTerm) ||
        user.fullName?.toLowerCase().includes(searchTerm) ||
        user.position?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.cityPhone?.toLowerCase().includes(searchTerm) ||
        user.mobilePhone?.toLowerCase().includes(searchTerm) ||
        user.internalPhone?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
});

onMounted(async () => {
  await departmentStore.getDepartments();
  await userStore.allDepartmentsEmployees(departmentStore.list);
});
</script>

<style lang="scss">
.phone-book {
  &-search {
    padding: 20px 20px 16px;
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
