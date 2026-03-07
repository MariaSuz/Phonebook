<template>
  <div> Hello</div>
</template>
<!-- <template>
  <VCard>
    <div class="phone-book">
      <div class="phone-book-search">
        <SearchInput
          v-model="searchValue"
          label="Поиск сотрудника"
          clearable
        />
      </div>
      <div class="phone-book-content">
        <div
          v-for="department in departments"
          :key="department.id"
          class="phone-book-department"
        >
          <div class="phone-book-table">
            <div class="phone-book-table-header">
              <span class="phone-book-header-department">
                {{ department.name }}</span
              >
            </div>
            <VDataTable
              :headers="headers"
              :items="usersByDepartment(department.id)"
              hide-default-footer
              :search="searchValue"
              class="phone-book-data-table"
            >
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
                    @click="remove(item)"
                    style="cursor: pointer;"
                  ></VIcon>
                </div>
              </template>
            </VDataTable>
          </div>
        </div>
        <div
          v-if="departments.length === 0"
          class="phone-book-not-found"
        >
          <p>Ничего не найдено</p>
        </div>
      </div>
    </div>
    <Modal
      v-model="isShowModalEditUser"
      backgroundColor="white"
      width="750"
    >
      <EditUserForm
        :user-data="selectedUser"
        @cancel="closeModal"
        @save="closeModal"
      />
    </Modal>
  </VCard>
</template>

<script setup lang="ts">
import SearchInput from '@/components/inputs/SearchInput.vue';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useDepartmentStore } from '@/store/departmentsStore';
import Modal from '@/components/Modal.vue';
import EditUserForm from '@/components/forms/EditUserForm.vue';
import type { UserFormModel } from '@/store/forms/UserFormModel';
import { watch } from 'vue';

const searchValue = ref('');
const userStore = useUserStore();
const departmentStore = useDepartmentStore();

const isShowModalEditUser = ref(false);
const selectedUser = ref<null | UserFormModel>(null);
const departments = computed(() => departmentStore.list);
const users = computed(() => userStore.list);

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

// const filteredDepartments = computed(() => {
//   if (!searchValue.value) return departments.value;

//   // фильтруем пользователей по поиску
//   const filteredUsers = users.value.filter((user) =>
//     Object.values(user).some(
//       (value) =>
//         value &&
//         value
//           .toString()
//           .toLowerCase()
//           .includes(searchValue.value.toLowerCase()),
//     ),
//   );

//   // создаем отделы из отфильтрованных пользователей
//   const arrayFilteredDepartments = Array.from(
//     new Set(filteredUsers.map((user) => user.department)),
//   );
//   const filteredDepartmentsArr = arrayFilteredDepartments.map(
//     (departmentName) => ({
//       name: departmentName,
//       users: filteredUsers.filter((user) => user.department === departmentName),
//     }),
//   );

//   return filteredDepartmentsArr;
// });

const edit = (user: UserFormModel) => {
  selectedUser.value = user;
  isShowModalEditUser.value = true;
};

const remove = (user: any) => {
  if (confirm(`Удалить сотрудника ${user.fullName}?`)) {
    userStore.deleteUser(user.id);
  }
};

const closeModal = () => {
  isShowModalEditUser.value = false;
  selectedUser.value = null;
};

const usersByDepartment = async (departmentId: number) => {
  return await userStore.getUsersByDepartment(departmentId);
}

// onMounted(async () => {
//   await departmentStore.getDepartments();
// });
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
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style> -->
