<template>
  <VCard>
    <div class="settings">
      <div class="settings__header">
        <span class="settings-title">Управление пользователями</span>
        <ButtonComponent
          v-if="isAdmin"
          prepend-icon="mdi-plus"
          title="Создать пользователя"
          @click="createUser"
          buttonType="save"
        />
      </div>
      <div class="settings-table">
        <VDataTable
          :headers="headers"
          :items="users"
          class="settings-data-table"
        >
          <template v-slot:item.roleId="{ item }">
            <VChip
              color="#8B4C39"
              size="small"
              class="role-chip"
            >
              {{ getRoleName(item.roleId) }}
            </VChip>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <VIcon
                v-if="isAdmin"
                color="medium-emphasis"
                icon="mdi-pencil"
                size="small"
                @click="edit(item)"
                style="cursor: pointer;"
              ></VIcon>
              <VIcon
                v-if="isAdmin"
                color="medium-emphasis"
                icon="mdi-delete"
                size="small"
                @click="removeUser(item)"
                style="cursor: pointer;"
              ></VIcon>
            </div>
          </template>
        </VDataTable>
      </div>
    </div>
    <FormModal
      v-model="modal.addUser"
      :form-component="UserForm"
      :form-type="FormTypes.ADD"
      @cancel="closeModal"
    />
    <FormModal
      v-model="modal.editUser"
      :form-component="UserForm"
      :form-type="FormTypes.EDIT"
      :data="selectedUser"
      :id="selectedUser?.id"
      @cancel="closeModal"
    />
    <ComfirmDelete
      v-model="modal.deleteUser"
      :title="selectedUser?.userName"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </VCard>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/usersStore';
import { useAuthStore } from '@/store/authStore';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, onMounted, reactive, ref } from 'vue';
import UserForm from '@/components/forms/UserForm.vue';
import FormModal from '@/components/modals/FormModal.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import UserFormModel from '@/components/forms/UserFormModel.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const headers = computed(() => [
  { key: 'userName', title: 'Пользователь' },
  { key: 'roleId', title: 'Роль'},
  {
    title: 'Действия',
    key: 'actions',
    align: 'end',
    width: '120px',
    sortable: false,
  }
]);

const selectedUser = ref<null | UserFormModel>(null);
const users = computed(() => userStore.list);
const modal = reactive({
  editUser: false,
  addUser: false,
  deleteUser: false,
});

const isAdmin = computed(() => authStore.isAdmin);

// Функция для получения названия роли
const getRoleName = (roleId: number) => {
  switch(roleId) {
    case 1: return 'Администратор';
    case 2: return 'Редактор';
    default: return `Роль ${roleId}`;
  }
};

const edit = (user: UserFormModel) => {
  selectedUser.value = user;
  modal.editUser = true;
};

const removeUser = async (user: UserFormModel) => {
  selectedUser.value = user;
  modal.deleteUser = true;
};
const confirmDelete = async () => {
  if (!selectedUser.value) return;
  try {
    await userStore.deleteUser(selectedUser.value.id!);
  } catch (error) {
    console.error('Ошибка удаления:', error);
  }
};

const createUser = () => {
  modal.addUser = true;
};

const closeModal = () => {
  modal.addUser = false;
  modal.editUser = false;
  modal.deleteUser = false;
  selectedUser.value = null;
};

onMounted(async () => {
  await userStore.getUsers();
});
</script>

<style lang="scss" scoped>
.settings {
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #FDF5F5, #FCE9E9);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  &-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #722F37;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  .v-icon {
    transition: all 0.2s;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      transform: scale(1.15);
    }
  }

  :deep(.v-data-table-footer) {
    background: #FDF5F5;
  }
}
</style>