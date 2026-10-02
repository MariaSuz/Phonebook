<template>
  <div class="announcements">
    <Breadcrumbs current="Анонсы" />
    <div class="announcements__header">
      <div>
        <h1 class="announcements__title font-heading">Анонсы</h1>
      </div>
      <ButtonComponent
        prepend-icon="mdi-plus"
        title="Создать анонс"
        buttonType="save"
        @click="openForm(FormTypes.ADD)"
      />
    </div>
    <div
      v-if="!store.items.length && !store.loading"
      class="announcements__empty"
    >
      <div class="announcements__empty-icon">
        <VIcon
          icon="mdi-volume-medium"
          size="28"
          color="primary"
        />
      </div>
      <h3 class="announcements__empty-title font-heading">Анонсов пока нет</h3>
      <p class="announcements__empty-text">
        Создайте объявление и оно появится в полосе над шапкой у всех сотрудников в указанное время.
      </p>
    </div>
    <TableComponent
      v-else
      :items="rows"
      :headers="headers"
      :is-loading="store.loading"
      :items-per-page="20"
      :highlightable-fields="['message', 'period', 'status']"
      :show-view="true"
      :can-edit="true"
      :can-delete="true"
      no-data="Анонсов пока нет"
      @view="openForm(FormTypes.SHOW, $event)"
      @edit="openForm(FormTypes.EDIT, $event)"
      @delete="askDelete"
    >
      <template v-slot:item.message="{ item }">
        <span :class="{ 'announcements__text--finished': item.status === 'finished' }">{{ item.message }}</span>
      </template>
      <template v-slot:item.period="{ item }">
        <span class="announcements__period">{{ item.period }}</span>
      </template>
      <template v-slot:item.status="{ item }">
        <VChip
          size="small"
          :variant="item.status === 'active' ? 'flat' : 'outlined'"
          :color="item.status === 'active' ? 'primary' : undefined"
        >{{ STATUS_LABELS[item.status as AnnouncementStatus] }}</VChip>
      </template>
    </TableComponent>
    <Modal
      v-model="formModal"
      width="600"
    >
      <AnnouncementForm
        :key="formKey"
        :form-type="formType"
        :data="selected"
        @save="saveItem"
        @cancel="formModal = false"
      />
    </Modal>
    <ComfirmDelete
      v-model="deleteModal"
      title="этот анонс"
      @confirm="confirmDelete"
      @cancel="deleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import TableComponent from '@/components/TableComponent.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import Modal from '@/components/modals/Modal.vue';
import AnnouncementForm from '@/components/forms/AnnouncementForm.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import type { AnnouncementFormModel } from '@/logic/types/forms/AnnouncementFormModel';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { formatPeriodShort, getAnnouncementStatus, type AnnouncementStatus } from '@/logic/utils/announcementUtils';

const STATUS_LABELS: Record<AnnouncementStatus, string> = {
  active: 'Идёт сейчас',
  scheduled: 'Запланирован',
  finished: 'Завершён',
};
const STATUS_ORDER: Record<AnnouncementStatus, number> = { active: 0, scheduled: 1, finished: 2 };

const store = useAnnouncementsStore();
const deleteModal = ref(false);
const itemToDelete = ref<AnnouncementFormModel | null>(null);

const headers = [
  { key: 'message', title: 'Текст', sortable: false },
  { key: 'period', title: 'Период показа', sortable: false, width: '260px' },
  { key: 'status', title: 'Статус', sortable: false, width: '160px' },
  { title: 'Действия', key: 'actions', align: 'end', width: '120px', sortable: false },
];

const rows = computed(() =>
  store.items
    .map((item) => ({
      ...item,
      period: formatPeriodShort(item.startsAt, item.endsAt),
      status: getAnnouncementStatus(item),
    }))
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || +new Date(b.startsAt) - +new Date(a.startsAt),
    ),
);

const formModal = ref(false);
const formType = ref<FormTypes>(FormTypes.ADD);
const formKey = ref(0); // пересоздаёт форму, чтобы она брала свежие данные
const selected = ref<AnnouncementFormModel | undefined>();

const openForm = (type: FormTypes, item?: AnnouncementFormModel) => {
  formType.value = type;
  selected.value = item;
  formKey.value++;
  formModal.value = true;
};

const saveItem = async (payload: Omit<AnnouncementFormModel, 'id'>) => {
  if (formType.value === FormTypes.EDIT && selected.value) {
    await store.updateAnnouncement(selected.value.id, payload);
  } else {
    await store.createAnnouncement(payload);
  }
  formModal.value = false;
};

const askDelete = (item: AnnouncementFormModel) => {
  itemToDelete.value = item;
  deleteModal.value = true;
};

const confirmDelete = async () => {
  if (itemToDelete.value) await store.deleteAnnouncement(itemToDelete.value.id);
  deleteModal.value = false;
  itemToDelete.value = null;
};

onMounted(() => store.getAll());
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.announcements {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 64px 16px;

    &-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $color-bg-muted;
      border: 1px solid $color-line;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    &-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: $color-primary-text;
      margin: 0 0 8px;
    }

    &-text {
      max-width: 420px;
      color: $color-secondary-text;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0 0 24px;
    }
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__period {
    font-variant-numeric: tabular-nums;
    color: $color-secondary-text;
  }

  &__text--finished {
    color: $color-muted;
  }
}
</style>
