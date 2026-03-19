<template>
  <VCard>
    <div class="settings">
      <div class="settings__header">
        <span class="settings-title">Управление пользователями</span>
        <VBtn
          v-if="isAdmin"
          prepend-icon="mdi-plus"
          @click="createUser"
          class="settings__btn"
        >
          Создать пользователя
        </VBtn>
      </div>
      <div class="settings-table">
        <VDataTable
          :headers="headers"
          :items="users"
          hide-default-footer
          class="settings-data-table"
        >
          <template v-slot:item.roleId="{ item }">
            <VChip
              color="#5a7a6a"
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
      :form-component="AuthUserForm"
      :form-type="FormTypes.ADD"
      @cancel="closeModal"
    />
    <FormModal
      v-model="isShowModalEditAuthUser"
      :form-component="modal.showUser"
      :form-type="FormTypes.SHOW"
      :data="selectedUser"
      :id="selectedUser?.id"
      @cancel="closeModal"
    />
    <FormModal
      v-model="modal.editUser"
      :form-component="AuthUserForm"
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
import { useAuthStore } from '@/store/authStore';
import type { AuthFormModel } from '@/logic/types/forms/AuthFormModel';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, onMounted, reactive, ref } from 'vue';
import AuthUserForm from '@/components/forms/AuthUserForm.vue';
import FormModal from '@/components/modals/FormModal.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';

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

const selectedUser = ref<null | AuthFormModel>(null);
const users = computed(() => authStore.list);
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

const edit = (user: AuthFormModel) => {
  selectedUser.value = user;
  modal.editUser = true;
};

const removeUser = async (user: AuthFormModel) => {
  selectedUser.value = user;
  modal.deleteUser = true;
};
const confirmDelete = async () => {
  if (!selectedUser.value) return;
  try {
    await authStore.deleteAuthUser(selectedUser.value.id!);
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
  await authStore.getAuthUsers();
});
</script>

<style lang="scss" scoped>
.settings {
  &__header {
    padding: 24px 28px 16px;
    background: linear-gradient(135deg, #f8fff8, #f0f7f0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  &-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e3c2c;
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  &__btn {
    border-radius: 30px !important;
    padding: 0 28px !important;
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
  .v-icon {
    transition: all 0.2s;
    opacity: 0.6;
    &:hover {
      opacity: 1;
      transform: scale(1.15);
    }
  }
}
</style>