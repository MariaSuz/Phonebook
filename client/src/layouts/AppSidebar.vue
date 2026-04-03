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
      <ButtonComponent
        v-if="authenticationUser"
        prepend-icon="mdi-plus"
        title="Создать отдел"
        @click="addDepartment"
        buttonType="save"
      />
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
import { useAuthStore } from '@/store/authStore';
import ButtonComponent from '@/components/ButtonComponent.vue';

const departmentStore = useDepartmentStore();
const sidebarStore = useSidebarStore();
const userStore = useEmployeesStore();
const authStore = useAuthStore();
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

const authenticationUser = authStore.isAuthenticated;

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
  background: linear-gradient(135deg, #722F37, #B22222);
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
  &__list-item {
    border-radius: 30px !important;
    margin: 4px 0;
    transition: all 0.2s ease;
    &:hover {
      background: #FCE9E9 !important;
      border-color: #C06060 !important;
      transform: translateY(-1px);
    }
    &.v-list-item--active {
      background: #FCE9E9 !important;
      border-color: #B22222 !important;
    }
     &:active {
      background: #C06060 !important;
      transform: scale(0.98);
    }
  }
}
</style>
