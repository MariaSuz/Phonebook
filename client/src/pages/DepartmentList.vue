<template>
  <VCard class="departments">
    <div class="departments-table-header">
      <div class="departments-table-header-left">
        <span class="departments-header-department">
          {{ department?.name || 'Отдел не найден' }}</span
        >
        <VIcon
          v-if="authenticationUser"
          color="white"
          icon="mdi-pencil"
          size="small"
          @click="editDepartment"
          class="departments-edit-icon"
        ></VIcon>
        <VIcon
          v-if="authenticationUser"
          color="white"
          icon="mdi-delete"
          size="small"
          @click="deleteDepartment"
          class="departments-edit-icon"
        ></VIcon>
      </div>
      <ButtonComponent
        v-if="authenticationUser"
        prepend-icon="mdi-plus"
        title="Добавить сотрудника"
        @click="addUser"
      />
    </div>

    <VDataTable
      :key="department?.id"
      :headers="headers"
      :loading="isLoading"
      :items="employees"
      hide-default-footer
      :items-per-page="-1"
      :search="search"
      class="departments__table"
    >
      <template
        v-for="field in highlightableFields"
        :key="field"
        v-slot:[`item.${field}`]="{ item }"
      >
        <span v-html="highlightText(item[field]) || '—'"></span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <VIcon
            color="medium-emphasis"
            icon="mdi-eye"
            size="small"
            @click="show(item)"
            style="cursor: pointer;"
          ></VIcon>
          <VIcon
            v-if="authenticationUser"
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="edit(item)"
            style="cursor: pointer;"
          ></VIcon>
          <VIcon
            v-if="authenticationUser"
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="removeEmployee(item)"
            style="cursor: pointer;"
          ></VIcon>
        </div>
      </template>
      <template v-slot:no-data>
        <div class="departments-empty">
        <ButtonComponent
          v-if="authenticationUser"
          prepend-icon="mdi-plus"
          title="Добавить первого сотрудника"
          @click="addUser"
          buttonType="save"
          class="btn-first"
        />
          <span
            v-if="!authenticationUser"
            class="departments-empty-title"
          >
            Сотрудники отсутствуют
        </span>
        </div>
      </template>
    </VDataTable>

    <FormModal
      v-model="modals.showEmployee"
      :form-component="EmployeeForm"
      :data="selectedEmployee"
      :id="selectedEmployee?.id"
      :form-type="FormTypes.SHOW"
      @cancel="closeModal"
    />
    <FormModal
      v-model="modals.addEmployee"
      :form-component="EmployeeForm"
      :form-type="FormTypes.ADD"
      :department-id="department?.id"
      @cancel="closeModal"
    />
    <FormModal
      v-model="modals.editEmployee"
      :form-component="EmployeeForm"
      :data="selectedEmployee"
      :id="selectedEmployee?.id"
      :department-id="department?.id"
      :form-type="FormTypes.EDIT"
      @cancel="closeModal"
    />
    <FormModal
      v-model="modals.editDepartment"
      :form-component="DepartmentForm"
      :form-type="FormTypes.EDIT"
      @cancel="closeModal"
      :data="department"
    />
    <ComfirmDelete
      v-model="modals.deleteDepartment"
      :title="department?.name"
      @confirm="confirmDeleteDepartment"
      @cancel="closeModal"
    />
    <ComfirmDelete
      v-model="modals.deleteEmployee"
      :title="selectedEmployee?.fullName"
      @confirm="confirmDeleteEmployee"
      @cancel="closeModal"
    />
    <WarningModal
      v-model="modals.warningDialog"
      message="В отделе находятся сотрудники. Пожалуйста, сначала удалите всех сотрудников, а затем повторите попытку."
     />
  </VCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useEmployeesStore } from '@/store/employeesStore';
import { useDepartmentStore } from '@/store/departmentsStore';
import FormModal from '@/components/modals/FormModal.vue';
import type { EmployeeFormModel } from '@/logic/types/forms/EmployeeFormModel';
import router from '@/router';
import { FormTypes } from '@/logic/types/FormTypes';
import DepartmentForm from '@/components/forms/DepartmentForm.vue';
import EmployeeForm from '@/components/forms/EmployeeForm.vue';
import { useAuthStore } from '@/store/authStore';
import { reactive } from 'vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import WarningModal from '@/components/modals/WarningModal.vue';

const props = defineProps<{
  departmentId: number;
  searchValue?: string;
  modelValue?: boolean;
}>();

const employeesStore = useEmployeesStore();
const departmentStore = useDepartmentStore();
const authStore = useAuthStore();

const modals = reactive({
  showEmployee: false,
  addEmployee: false,
  editEmployee: false,
  editDepartment: false,
  deleteDepartment: false,
  deleteEmployee: false,
  warningDialog: false,
});

const search = computed(() => props.searchValue ?? '');
const department = computed(() =>
  departmentStore.list.find(dep => dep.id === +props.departmentId)
);
const authenticationUser = computed(() => authStore.isAuthenticated);
const employees = computed(() => {
  return (employeesStore.list || []).filter(user => user.departmentId == +props.departmentId);
})
const isLoading = computed(() => departmentStore.loading || employeesStore.loading);

const highlightableFields = computed(() => [
  'cabinet', 'position', 'fullName', 'internalPhone',
  'cityPhone', 'mobilePhone', 'email'
]);

// const isEmpty = computed(() => users.value.length === 0);

const selectedEmployee = ref<null | EmployeeFormModel>(null);
const headers = computed(() => [
  { key: 'cabinet', title: '№ кабинета', width: '80px' },
  { key: 'position', title: 'Должность', width: '180px' },
  { key: 'fullName', title: 'Ф.И.О', width: '340px' },
  { key: 'internalPhone', title: 'Внутренний номер', width: '100px' },
  { key: 'cityPhone', title: 'Городской номер', width: '200px' },
  { key: 'mobilePhone', title: 'Сотовый номер', width: '200px' },
  { key: 'email', title: 'Почта', width: '200px' },
  {
    title: 'Действия',
    key: 'actions',
    sortable: false,
    align: 'end',
    width: '100px'
  }
]);

const edit = (user: EmployeeFormModel) => {
  selectedEmployee.value = user;
  modals.editEmployee = true;
};
const show = (user: EmployeeFormModel) => {
  selectedEmployee.value = user;
  modals.showEmployee = true;
};
const addUser = () => {
  modals.addEmployee = true;
};
const editDepartment = () => {
  modals.editDepartment = true;
};

const removeEmployee = (user: EmployeeFormModel) => {
  modals.deleteEmployee = true;
  selectedEmployee.value = user;
};
const confirmDeleteEmployee = () => {
  employeesStore.deleteEmployee(selectedEmployee?.value?.id!);
};
const deleteDepartment = () => {
  modals.deleteDepartment = true;
};
const confirmDeleteDepartment = async () => {
  const hasEmployees = employees.value.length > 0;
  if (hasEmployees) {
    modals.deleteDepartment = false;
    modals.warningDialog = true;
  } else {
    try {
      await departmentStore.deleteDepartment(department.value?.id!);
      modals.deleteDepartment = false;
      router.push('/');
    } catch (error) {
      console.error('Ошибка при удалении отдела:', error);
    }
  }
};

const closeModal = () => {
  modals.showEmployee = false;
  modals.addEmployee = false;
  modals.editEmployee = false;
  modals.editDepartment = false;
  modals.deleteDepartment = false;
  modals.deleteEmployee = false;
  selectedEmployee.value = null;
};

//Подстветка текста
const highlightText = (text: string | number) => {
  if (!props.searchValue || !text) return text;

  const query = props.searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(query, 'ig');

  return String(text).replace(regex, '<span class="highlight">$&</span>');
};
</script>

<style lang="scss">
.departments {
  th {
    background: transparent !important;
    color: #722F37 !important;
    font-weight: 600 !important;
    border-bottom: 2px solid #C06060 !important;
  }
  &-table-header {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(135deg, #722F37, #B22222);
    border-left: 4px solid #C06060;
    padding: 10px 15px;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(114, 47, 55, 0.3);
    border-radius: 0 0 8px 8px;
    &-left {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }

  &-empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #722F37;
    margin: 16px;
  }

  &-header-department {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &-search {
    padding: 20px 20px 16px;
    background: #FDF5F5;
    box-shadow: 0 2px 8px rgba(114, 47, 55, 0.1);
    border-bottom: 1px solid #E5C7C7;
  }

  &-not-found {
    width: 100%;
    font-size: 1.25rem;
    font-weight: 600;
    color: #722F37;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .highlight {
    background-color: #C06060;
    color: white;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
  }

  .btn-first {
    margin: 20px;
    .v-icon {
      color: white;
    }

  }

  .v-icon {
    transition: all 0.2s;
    opacity: 0.7;
    color: #8B4C39;

    &:hover {
      opacity: 1;
      transform: scale(1.15);
      color: #B22222;
    }
  }
}
</style>