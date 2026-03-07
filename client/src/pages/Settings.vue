<template>
  <VCard>
    <div class="settings">
      <VCardTitle class="d-flex justify-space-between align-center">
        <span>Управление пользователями</span>
        <VBtn
          prepend-icon="mdi-plus"
          @click="createUser"
        >
          Создать пользователя
        </VBtn>
      </VCardTitle>
      <div class="settings-table">
        <VDataTable
          :headers="headers"
          :items="users"
          hide-default-footer
          class="departments-data-table"
        >
          <template v-slot:item.avatar="{ item }">
            <VAvatar size="small" v-if="item.avatar">
              <VImg :src="item.avatar" />
            </VAvatar>
            <VAvatar size="small" color="primary" v-else>
              <span class="text-white">{{ item.userName?.charAt(0) }}</span>
            </VAvatar>
          </template>
          <template v-slot:item.roleId="{ item }">
            {{ getRoleName(item.roleId) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <VIcon
                v-if="isAdmin || authStore.currentUser?.id === item.id"
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
    <AuthUserAddModal
      v-model="isShowModalCreateAuthUser"
      @cancel="closeModal"
    />
    <AuthUserEditModal
      v-model="isShowModalEditAuthUser"
      :user-data="selectedUser"
      :user-id="selectedUser?.id"
      :form-type="FormTypes.EDIT"
      @cancel="closeModal"
    />
  </VCard>
</template>

<script setup lang="ts">
import AuthUserAddModal from '@/components/modals/AuthUserAddModal.vue';
import AuthUserEditModal from '@/components/modals/AuthUserEditModal.vue';
import { useAuthStore } from '@/store/authStore';
import type { AuthFormModel } from '@/store/forms/AuthFormModel';
import { FormTypes } from '@/store/forms/FormTypes';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();

const headers = computed(() => [
  { key: 'avatar', title: 'Аватар', sortable: false, align: 'center', width: '80px' },
  { key: 'userName', title: 'Пользователь' },
  { key: 'roleId', title: 'Роль', sortable: false },
  {
    title: 'Действия',
    key: 'actions',
    sortable: false,
    align: 'end',
    width: '120px'
  }
]);

const selectedUser = ref<null | AuthFormModel>(null);
const users = computed(() => authStore.list);
const isShowModalEditAuthUser = ref(false);
const isShowModalCreateAuthUser = ref(false);

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
  isShowModalEditAuthUser.value = true;
};

const removeUser = async (user: AuthFormModel) => {
  if (confirm(`Удалить пользователя ${user.userName}?`)) {
    try {
      await authStore.deleteAuthUser(user.id!);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }
};

const createUser = () => {
  isShowModalCreateAuthUser.value = true;
  console.log('Создание пользователя');
};

const closeModal = () => {
  isShowModalCreateAuthUser.value = false;
  selectedUser.value = null;
  isShowModalEditAuthUser.value = false;
};

onMounted(async () => {
  await authStore.getAuthUsers();
});
</script>

<style lang="scss" scoped>
.settings {
  &-table {
    padding: 20px;
  }
}

.error-message {
  margin: 0 20px;
}

.departments-data-table {
  ::v-deep(.v-data-table__th) {
    background-color: #f5f5f5;
  }
}
</style>