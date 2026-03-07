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
  &-table-header {
    // background: linear-gradient(135deg, #10b981 0%, #0d9668 100%);
    background: #344e41;
    border-left: 4px solid #065f46;
    padding: 10px 15px;
    margin-bottom: 8px;
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }
  &-header-department {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  &-search {
    padding: 20px 20px 16px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e5e7eb;
  }
  &-not-found {
    width: 100%;
    font-size: 1.25rem;
    font-weight: 600;
    color: #065f46;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
