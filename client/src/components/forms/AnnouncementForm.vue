<template>
  <BaseForm
    :title="formTitle"
    :form-type="formType"
    :disabled="v.$invalid"
    :is-loading="isLoading"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="announcement-form__eyebrow">Анонсы</div>
      <h2 class="announcement-form__title font-heading">{{ formTitle }}</h2>
      <div class="announcement-form__subtitle">Появится в полосе над шапкой у всех сотрудников</div>
    </template>
    <Textarea
      v-model="form.message"
      label="Текст объявления"
      placeholder="Будут проводиться профилактические работы, возможны перебои интернета."
      counter="200"
      maxlength="200"
      hint="Одна-две фразы: что случится и что перестанет работать."
      :error-messages="v.message.$errors.map((e: any) => e.$message)"
      @blur="v.message.$touch"
    />
    <div class="announcement-form__dates">
      <TextField
        v-model="form.startsAt"
        label="Начало работ"
        type="datetime-local"
        icon="mdi-calendar-start"
        :clearable="false"
        :error-messages="v.startsAt.$errors.map((e: any) => e.$message)"
        :error="v.startsAt.$error"
        @blur="v.startsAt.$touch"
      />
      <TextField
        v-model="form.endsAt"
        label="Окончание работ"
        type="datetime-local"
        icon="mdi-calendar-end"
        :clearable="false"
        :error-messages="v.endsAt.$errors.map((e: any) => e.$message)"
        :error="v.endsAt.$error"
        @blur="v.endsAt.$touch"
      />
    </div>
    <Select
      v-model="form.showBeforeHours"
      label="Показывать заранее"
      :items="SHOW_BEFORE_OPTIONS"
      item-title="title"
      item-value="value"
      icon="mdi-clock-outline"
    />
    <div
      v-if="showFromHint"
      class="announcement-form__hint"
    >{{ showFromHint }}</div>
    <div
      v-if="preview"
      class="announcement-form__preview"
    >
      <div class="announcement-form__preview-label">Так увидят сотрудники</div>
      <AnnouncementStrip
        phase="upcoming"
        :message="form.message"
        :period="preview.period"
        :end-time="preview.endTime"
      />
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { announcementRules } from '@/logic/validation/announcementValidation';
import { FormTypes } from '@/logic/types/FormTypes';
import type { AnnouncementFormModel } from '@/logic/types/forms/AnnouncementFormModel';
import {
  SHOW_BEFORE_OPTIONS,
  formatEndTime,
  formatPeriod,
  fromInputValue,
  toInputValue,
} from '@/logic/utils/announcementUtils';
import AnnouncementStrip from '@/components/widgets/AnnouncementStrip.vue';
import TextField from '@/components/inputs/TextField.vue';
import Textarea from '@/components/inputs/Textarea.vue';
import Select from '@/components/inputs/Select.vue';
import BaseForm from './BaseForm.vue';

const props = defineProps<{ formType: FormTypes; data?: AnnouncementFormModel }>();
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', payload: Omit<AnnouncementFormModel, 'id'>): void;
}>();

const isEdit = computed(() => props.formType === FormTypes.EDIT);
const formTitle = computed(() => (isEdit.value ? 'Изменить анонс' : 'Новый анонс'));

const form = ref({
  message: props.data?.message ?? '',
  startsAt: props.data ? toInputValue(props.data.startsAt) : '',
  endsAt: props.data ? toInputValue(props.data.endsAt) : '',
  showBeforeHours: props.data?.showBeforeHours ?? 24,
});

const v = useVuelidate(announcementRules, form);

const preview = computed(() => {
  const { startsAt, endsAt } = form.value;
  if (!startsAt || !endsAt) return null;
  const s = fromInputValue(startsAt);
  const e = fromInputValue(endsAt);
  return { period: formatPeriod(s, e), endTime: formatEndTime(e) };
});

const showFromHint = computed(() => {
  const { showBeforeHours, startsAt } = form.value;
  if (!startsAt) return '';
  if (!showBeforeHours) return 'Полоса появится только в момент начала работ.';
  const from = new Date(new Date(startsAt).getTime() - showBeforeHours * 3_600_000);
  const label = from.toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  return `С ${label}. До начала работ полосу можно скрыть крестиком.`;
});

const onSubmitForm = async () => {
  if (!(await v.value.$validate())) return;
  emit('save', {
    message: form.value.message.trim(),
    startsAt: fromInputValue(form.value.startsAt),
    endsAt: fromInputValue(form.value.endsAt),
    showBeforeHours: form.value.showBeforeHours,
  });
};
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.announcement-form {
  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-primary));
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__subtitle {
    font-size: 0.85rem;
    color: $color-secondary-text;
    margin-top: 4px;
  }

  &__dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__hint {
    margin-top: -8px;
    font-size: 0.78rem;
    color: $color-muted;
  }

  &__preview {
    border: 1px solid $color-line;
    border-radius: 4px;
    overflow: hidden;

    &-label {
      padding: 8px 18px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: $color-secondary-text;
    }
  }
}
</style>
