<template>
  <VNavigationDrawer
    v-model="isSidebarOpen"
    class="sidebar"
    temporary
  >
    <div class="sidebar__header">
      <h3 class="sidebar__title">Отделы</h3>
    </div>
    <div class="sidebar__content">
      <VBtn
        prepend-icon="mdi-plus"
        @click="addDepartment"
        class="sidebar__btn"
      >
        Создать отдел
      </VBtn>
      <VDivider class="sidebar__divider" />
      <VList class="sidebar__list">
        <VListItem
          v-for="department in departments"
          :key="department.id"
          :title="department.name"
          :value="department.name"
          class="sidebar__list-item"
          prepend-icon="mdi-account-group"
          @click="goToDepartment(department.id)"
        >
          <template v-slot:append>
            <span class="sidebar__item-count">
              {{ getEmployeeCount(department.id) }}
            </span>
          </template>
        </VListItem>
    </VList>
    </div>
    <FormModal
      v-model="isShowModalAddDepartment"
      :form-component="DepartmentForm"
      :form-type="FormTypes.ADD"
      @cancel="closeModal"
    />
  </VNavigationDrawer>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useDepartmentStore } from '@/store/departmentsStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { useRouter } from 'vue-router';
import FormModal from '@/components/modals/FormModal.vue';
import { ref } from 'vue';
import { useEmployeesStore } from '@/store/employeesStore';
import DepartmentForm from '@/components/forms/DepartmentForm.vue';
import { FormTypes } from '@/logic/types/FormTypes';

const departmentStore = useDepartmentStore();
const sidebarStore = useSidebarStore();
const userStore = useEmployeesStore();
const departments = computed(() => departmentStore.list);
const router = useRouter();
const isShowModalAddDepartment = ref(false);

const isSidebarOpen = computed({
  get: () => sidebarStore.isSidebarOpen,
  set: (value) => {
    if (sidebarStore.isSidebarOpen !== value) {
      sidebarStore.toggleSidebar();
    }
  }
});

const getEmployeeCount = (departmentId) => {
  return userStore.list.filter(user => user.departmentId === departmentId).length;
};

const goToDepartment = (id) => {
  sidebarStore.toggleSidebar();
  router.push({
    name: 'departments',
    params: { departmentId: id }
  }
  )
};
onMounted(async () => {
  await departmentStore.getDepartments();
  await userStore.getEmployees();
});

const closeModal = () => {
  isShowModalAddDepartment.value = false;
};
const addDepartment = () => {
  isShowModalAddDepartment.value = true;
};
</script>

<style lang="scss">
.sidebar {
  &__header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 12px;
  background: linear-gradient(135deg, #1e3c2c, #2a5a3a);
    .sidebar__title {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
      margin: 0;
      letter-spacing: 0.3px;
    }
  }
  &__content {
  display: flex;
  flex-direction: column;
  padding: 16px;
  }
  &__btn {
    border-radius: 30px !important;
    padding: 28px;
    height: 44px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    letter-spacing: 0.3px !important;
    background: linear-gradient(135deg, #1e3c2c, #2a5a3a) !important;
    color: white !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3) !important;
    &:hover {
      background: linear-gradient(135deg, #2a5a3a, #1e3c2c) !important;
      box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4) !important;
    }
  }
  &__list-item {
    border-radius: 30px !important;
    margin: 4px 0;
    transition: all 0.2s ease;
    :deep(.v-list-item__prepend) {
      .v-icon {
        color: #7ccf7c !important;
      }
    }
    :deep(.v-list-item__content) {
      font-weight: 500;
      color: #1e3c2c;
    }
    &:hover {
      background: #f0f7f0 !important;
      :deep(.v-list-item__prepend .v-icon) {
        color: #2e7d32 !important;
      }
    }
  }
}
</style>
