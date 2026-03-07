<template>
  <VCard>
    <div class="departments">
      <div class="departments-content">
        <div class="departments-department">
          <div class="departments-table">
            <div class="departments-table-header">
              <div class="departments-table-header-left">
                <span class="departments-header-department">
                  {{ department?.name || 'Отдел не найден' }}</span
                >
                <VIcon
                  color="white"
                  icon="mdi-pencil"
                  size="small"
                  @click="editDepartment"
                  class="departments-edit-icon"
                ></VIcon>
                <VIcon
                  color="white"
                  icon="mdi-delete"
                  size="small"
                  @click="deleteDepartment"
                  class="departments-edit-icon"
                ></VIcon>
              </div>
              <VBtn
                prepend-icon="mdi-plus"
                @click="addUser"
                class="departments-btn"
              >
                Добавить сотрудника
              </VBtn>
            </div>
            <VDataTable
              :key="department?.id"
              :headers="headers"
              :items="users"
              hide-default-footer
              :search="search"
              class="departments-data-table"
            >

               <!-- Подсветка для всех текстовых колонок -->
              <template v-slot:item.cabinet="{ item }">
                <span v-html="highlightText(item.cabinet) || '—'"></span>
              </template>
              <template v-slot:item.position="{ item }">
                <span v-html="highlightText(item.position) || '—'"></span>
              </template>
              <template v-slot:item.fullName="{ item }">
                <span v-html="highlightText(item.fullName) || '—'"></span>
              </template>
              <template v-slot:item.internalPhone="{ item }">
                <span v-html="highlightText(item.internalPhone) || '—'"></span>
              </template>
              <template v-slot:item.cityPhone="{ item }">
                <span v-html="highlightText(item.cityPhone) || '—'"></span>
              </template>
              <template v-slot:item.mobilePhone="{ item }">
                <span v-html="highlightText(item.mobilePhone) || '—'"></span>
              </template>
              <template v-slot:item.email="{ item }">
                <span v-html="highlightText(item.email) || '—'"></span>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2 justify-end">
                  <VIcon
                    color="medium-emphasis"
                    icon="mdi-pencil"
                    size="small"
                    @click="edit(item)"
                    style="cursor: pointer;"
                  ></VIcon>

                  <VIcon
                    color="medium-emphasis"
                    icon="mdi-delete"
                    size="small"
                    @click="removeUser(item)"
                    style="cursor: pointer;"
                  ></VIcon>
                </div>
              </template>
              <template v-slot:no-data>
                <div class="departments-empty">
                  <VBtn
                    prepend-icon="mdi-plus"
                    @click="addUser"
                    class="departments-btn__first"
                  >
                    Добавить первого сотрудника
                  </VBtn>
                </div>
              </template>
            </VDataTable>
          </div>
        </div>
      </div>
    </div>
    <UserAddModal
      v-model="isShowModalAddUser"
      @cancel="closeModal"
    />
    <UserEditModal
      v-model="isShowModalEditUser"
      :user-data="selectedUser"
      :user-id="selectedUser?.id"
      :form-type="FormTypes.EDIT"
      @cancel="closeModal"
    />
    <DepartmentEditModal
      v-model="isShowModalEditDepartment"
      @cancel="closeModal"
      :department-data="department"
    />
  </VCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEmployeesStore } from '@/store/employeesStore';
import { useDepartmentStore } from '@/store/departmentsStore';
import UserAddModal from '@/components/modals/UserAddModal.vue';
import UserEditModal from '@/components/modals/UserEditModal.vue';
import DepartmentEditModal from '@/components/modals/DepartmentEditModal.vue';
import type { UserFormModel } from '@/store/forms/EmployeeFormModel';
import router from '@/router';
import { FormTypes } from '@/store/forms/FormTypes';

const props = defineProps<{
  departmentId: number;
  searchValue?: string;
  modelValue?: boolean;
}>();

const userStore = useEmployeesStore();
const departmentStore = useDepartmentStore();

const isShowModalEditUser = ref(false);
const isShowModalAddUser = ref(false);
const isShowModalEditDepartment = ref(false);

const search = computed(() => props.searchValue ?? '');
const departmentsList = computed(() => departmentStore.list);
const department = computed(() =>
  departmentsList.value.find(dep => dep.id === +props.departmentId)
);
const users = computed(() => {
  return userStore.list.filter(user => user.departmentId == +props.departmentId);
})

// const isEmpty = computed(() => users.value.length === 0);

const selectedUser = ref<null | UserFormModel>(null);
const headers = computed(() => [
  { key: 'cabinet', title: '№ кабинета' },
  { key: 'position', title: 'Должность' },
  { key: 'fullName', title: 'ФИО' },
  { key: 'internalPhone', title: 'Внутренний номер' },
  { key: 'cityPhone', title: 'Городской номер' },
  { key: 'mobilePhone', title: 'Сотовый номер' },
  { key: 'email', title: 'Почта' },
  {
    title: 'Действия',
    key: 'actions',
    sortable: false,
    align: 'end',
    width: '120px'
  }
]);

const edit = (user: UserFormModel) => {
  selectedUser.value = user;
  isShowModalEditUser.value = true;
};

const removeUser = (user: any) => {
  if (confirm(`Удалить сотрудника ${user.fullName}?`)) {
    userStore.deleteEmployee(user.id);
  }
};
const deleteDepartment = (user: any) => {
  if (confirm(`Удалить отдел ${department?.value?.name}}?`)) {
    departmentStore.deleteDepartment(department?.value?.id);
    router.push('/');
  }
};

const closeModal = () => {
  isShowModalEditUser.value = false;
  selectedUser.value = null;
  isShowModalAddUser.value = false;
  isShowModalEditDepartment.value = false;
};

const addUser = () => {
  isShowModalAddUser.value = true;
};
const editDepartment = () => {
  isShowModalEditDepartment.value = true;
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
  &-table-header {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(135deg, #1e3c2c, #2a5a3a);
    border-left: 4px solid #7ccf7c;
    padding: 10px 15px;
    margin-bottom: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    border-radius: 0 0 8px 8px;
    &-left {
      display: flex;
      gap: 10px;
      align-items: center;
    }
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
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-btn {
    background: #ffffff !important;
    color: #1e3c2c !important;
    border-radius: 30px !important;
    font-weight: 600 !important;
    text-transform: none !important;
    padding: 0 20px !important;
    height: 40px !important;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    &:hover {
      background: #f0f7f0 !important;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2) !important;
    }
    i {
      color: #2e7d32 !important;
      font-size: 1.2rem !important;
    }
    &__first {
      background: linear-gradient(135deg, #1e3c2c, #2a5a3a) !important;
      color: white !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      i {
        color: white !important;
      }
      &:hover {
        background: linear-gradient(135deg, #2a5a3a, #1e3c2c) !important;
      }
    }
  }
  .highlight {
    background-color: #fbbf24;
    color: #000;
    padding: 2px 4px;
    border-radius: 3px;
    font-weight: 600;
  }

  .v-icon {
    transition: all 0.2s;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      transform: scale(1.15);
      &[icon="mdi-pencil"] {
        color: #1e88e5 !important;
      }
      &[icon="mdi-delete"] {
        color: #e53935 !important;
      }
    }
  }
}
</style>