<template>
  <div class="settings">
    <Breadcrumbs current="Пользователи" />
    <div class="settings__header">
      <div>
        <h1 class="settings__title font-heading">Пользователи</h1>
        <p class="settings__subtitle">{{ totalLabel }} · {{ adminLabel }}</p>
      </div>
      <ButtonComponent
        v-if="isAdmin"
        prepend-icon="mdi-plus"
        title="Создать пользователя"
        @click="createUser"
        buttonType="save"
      />
    </div>
    <div class="settings__filters">
      <SearchInput
        v-model="searchValue"
        label="Поиск по логину"
        clearable
      />
      <div class="settings__role-filters">
        <button
          v-for="option in roleFilterOptions"
          :key="option.value ?? 'all'"
          type="button"
          class="settings__role-filter"
          :class="{ 'settings__role-filter--active': roleFilter === option.value }"
          @click="roleFilter = option.value"
        >{{ option.label }}</button>
      </div>
    </div>
    <TableComponent
      :items="filteredUsers"
      :headers="headers"
      :is-loading="isLoading"
      :items-per-page="10"
      :highlightable-fields="['userName', 'roleId']"
      :show-view="false"
      :can-edit="isAdmin"
      :can-delete="isAdmin"
      @edit="edit"
      @delete="removeUser"
    >
      <template v-slot:item.userName="{ item }">
        <div class="settings__user">
          <div
            class="settings__avatar"
            :class="{ 'settings__avatar--admin': item.roleId === 1 }"
          >{{ getInitials(item.userName) }}</div>
          <div class="settings__user-info">
            <div class="settings__user-name">{{ item.userName }}</div>
            <div
              v-if="isSelf(item)"
              class="settings__user-tag"
            >это вы</div>
          </div>
        </div>
      </template>
      <template v-slot:item.roleId="{ item }">
        <VChip
          size="small"
          class="role-chip"
          :class="item.roleId === 1 ? 'role-chip--admin' : 'role-chip--editor'"
          :variant="item.roleId === 1 ? 'flat' : 'outlined'"
        >
          {{ getRoleName(item.roleId) }}
        </VChip>
      </template>
    </TableComponent>
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
      :subtitle="selectedUser ? getRoleName(selectedUser.roleId) : ''"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/usersStore';
import { useAuthStore } from '@/store/authStore';
import { FormTypes } from '@/logic/types/FormTypes';
import { computed, onMounted, reactive, ref } from 'vue';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';
import UserForm from '@/components/forms/UserForm.vue';
import FormModal from '@/components/modals/FormModal.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import TableComponent from '@/components/TableComponent.vue';
import SearchInput from '@/components/inputs/SearchInput.vue';
import type { UserFormModel } from '@/logic/types/forms/UserFormModel';
import { pluralizeRu } from '@/logic/utils/pluralize';

const userStore = useUserStore();
const authStore = useAuthStore();
const isLoading = computed(() => userStore.loading);

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

const searchValue = ref('');
const roleFilter = ref<number | null>(null);
const roleFilterOptions = [
  { value: null, label: 'Все роли' },
  { value: 1, label: 'Администратор' },
  { value: 2, label: 'Редактор' },
];

const filteredUsers = computed(() => {
  const query = searchValue.value.trim().toLowerCase();
  return users.value.filter((user) => {
    const matchesRole = roleFilter.value === null || user.roleId === roleFilter.value;
    const matchesSearch = !query || user.userName.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });
});

const totalLabel = computed(() => {
  const count = users.value.length;
  return `${count} ${pluralizeRu(count, ['учётная запись', 'учётные записи', 'учётных записей'])}`;
});

const adminLabel = computed(() => {
  const count = users.value.filter((user) => user.roleId === 1).length;
  return `${count} ${pluralizeRu(count, ['администратор', 'администратора', 'администраторов'])}`;
});

const getInitials = (userName: string) => userName.slice(0, 2).toUpperCase();
const isSelf = (user: UserFormModel) => user.id === authStore.authUser?.id;

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
  if (isSelf(user)) return;
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
@import '@/styles/colors';

.settings {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__subtitle {
    margin: 4px 0 0;
    font-size: 0.85rem;
    color: $color-secondary-text;
  }

  &__filters {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  &__role-filters {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  &__role-filter {
    height: 40px;
    padding: 0 16px;
    border-radius: 4px;
    border: 1px solid $color-line;
    background: rgb(var(--v-theme-surface));
    color: $color-secondary-text;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      border-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-primary));
    }

    &--active {
      background: rgb(var(--v-theme-primary));
      border-color: rgb(var(--v-theme-primary));
      color: white;

      &:hover {
        color: white;
      }
    }
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $color-bg-muted;
    color: rgb(var(--v-theme-primary));
    font-size: 0.75rem;
    font-weight: 700;

    &--admin {
      background: rgb(var(--v-theme-primary));
      color: white;
    }
  }

  &__user-name {
    font-weight: 600;
    color: $color-primary-text;
    font-size: 0.9rem;
  }

  &__user-tag {
    font-size: 0.75rem;
    color: $color-muted;
  }
}

.role-chip {
  font-weight: 700 !important;
  letter-spacing: 0.02em;

  &--admin {
    background: rgb(var(--v-theme-primary)) !important;
    color: white !important;
  }

  &--editor {
    color: rgb(var(--v-theme-primary)) !important;
    border-color: $color-line !important;
  }
}
</style>
