<template>
  <VCard
    ref="rootCard"
    class="departments"
  >
    <div
      class="departments-table-header"
      :class="{
        'departments-table-header--collapsed': collapsed,
        'departments-table-header--drag': sortMode,
       }"
    >
      <div class="departments-table-header-left">
        <div
          class="departments-collapse"
          @click="toggleCollapse"
        >
          <VIcon
          color="primary"
          :icon="collapsed ? 'mdi-chevron-right' : 'mdi-chevron-down'"
          size="small"
          class="departments-collapse-icon"
        ></VIcon>
        <span
          class="departments-header-department"
          v-html="highlightDepartmentName(department?.name)"
        ></span>
        </div>
        <template v-if="!collapsed">
          <ActionButtons
            :show-view="false"
            :can-edit="authenticationUser"
            @edit="editDepartment"
            @delete="deleteDepartment"
          />
        </template>
      </div>
      <ButtonComponent
        v-if="authenticationUser && !collapsed"
        prepend-icon="mdi-plus"
        title="Добавить сотрудника"
        buttonType="cancel"
        @click="addUser"
      />
    </div>
    <VExpandTransition>
      <div v-show="!collapsed">
        <TableComponent
          :table-key="department?.id"
          :items="employees"
          :headers="headers"
          :is-loading="isLoading"
          :search="search"
          :items-per-page="-1"
          :hide-default-footer="true"
          :highlightable-fields="highlightableFields"
          :show-actions="true"
          :show-view="true"
          :can-edit="authenticationUser"
          :can-delete="authenticationUser"
          :no-data="!authenticationUser ? 'Сотрудники отсутствуют' : undefined"
          :no-data-button-title="authenticationUser ? 'Добавить первого сотрудника' : undefined"
          @view="show"
          @edit="edit"
          @delete="removeEmployee"
          @no-data-action="addUser"
        >
          <template
            v-for="field in highlightableFields"
            :key="field"
            #[`item.${field}`]="{ item }"
          >
            <span v-html="highlightText(item[field]) || '—'"></span>
          </template>
        </TableComponent>
      </div>
    </VExpandTransition>
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
      width="520"
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
      :subtitle="employeeDeleteSubtitle"
      @confirm="confirmDeleteEmployee"
      @cancel="closeModal"
    />
    <WarningModal
      v-model="modals.warningDialog"
      :department-name="department?.name"
      :department-id="department?.id"
      :employees="employees"
      @cancel="closeModal"
     />
  </VCard>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
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
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import TableComponent from '@/components/TableComponent.vue';
import WarningModal from '@/components/modals/WarningModal.vue';

const props = defineProps<{
  departmentId: number;
  searchValue?: string;
  modelValue?: boolean;
  collapsed?: boolean;
  searchQuery?: string;
  sortMode?: boolean;
}>();

const employeesStore = useEmployeesStore();
const departmentStore = useDepartmentStore();
const authStore = useAuthStore();

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void;
}>();

const toggleCollapse = () => emit('update:collapsed', !props.collapsed);

const rootCard = ref<{ $el: HTMLElement } | null>(null);

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
const deletingEmployeeId = ref<number | null>(null);

const employeeDeleteSubtitle = computed(() => {
  if (!selectedEmployee.value) return '';
  return [selectedEmployee.value.position, department.value?.name].filter(Boolean).join(' · ');
});

const highlightableFields = computed(() => [
  'cabinet', 'position', 'internalPhone',
  'cityPhone', 'mobilePhone', 'email', 'fullName',
]);

// const isEmpty = computed(() => users.value.length === 0);

const selectedEmployee = ref<null | EmployeeFormModel>(null);
const headers = computed(() => [
  { key: 'cabinet', title: 'Кабинет', width: '80px' },
  { key: 'position', title: 'Должность', width: '180px' },
  { key: 'fullName', title: 'Ф.И.О', width: '340px' },
  { key: 'internalPhone', title: 'Внутренний', width: '100px' },
  { key: 'cityPhone', title: 'Городской', width: '200px' },
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
const confirmDeleteEmployee = async () => {
  const id = selectedEmployee.value?.id!;
  deletingEmployeeId.value = id;
  try {
    await employeesStore.deleteEmployee(id);
  } finally {
    deletingEmployeeId.value = null;
  }
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

const highlightDepartmentName = (text?: string) => {
  if (!text) return 'Отдел не найден';
  if (!props.searchQuery) return text;

  const query = props.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(query, 'ig');

  return text.replace(regex, '<span class="department-name-highlight">$&</span>');
};
</script>

<style lang="scss">
@import '@/styles/colors';

.departments {
  border-radius: 4px !important;
  overflow: hidden;

  &-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $color-line;
    padding: 10px 15px;
    &--drag {
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
      .departments-collapse {
        cursor: grab;
      }
      &:active .departments-collapse {
        cursor: grabbing;
      }
    }
    &-left {
      display: flex;
      gap: 10px;
      align-items: center;
    }
     &--collapsed {
      border-bottom: none;
      .departments-table-header-left,
      .departments-collapse {
        flex: 1;
      }
    }
  }
  .department-name-highlight {
    background: $color-bg-muted;
    color: rgb(var(--v-theme-primary));
    padding: 1px 6px;
    border-radius: 4px;
  }

  &-collapse {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.3);
    }
    &-left {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;
    }
  }

  &-empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: rgb(var(--v-theme-primary));
    margin: 16px;
  }

  &-header-department {
    font-size: 1.1rem;
    font-weight: 500;
    color: $color-primary-text;
    white-space: nowrap;
  }

  &-fullname {
    color: $color-primary-text;
    font-weight: 600;
  }

  .highlight {
    background-color: rgba(var(--v-theme-primary), 0.14);
    color: rgb(var(--v-theme-primary));
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
  }
}
</style>