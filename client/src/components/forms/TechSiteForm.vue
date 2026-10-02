<template>
  <BaseForm
    title="Добавление сайта"
    :form-type="formType"
    :is-loading="isLoading"
    :progress="isLoading"
    @cancel="emit('cancel')"
    @submit="onSubmitForm"
  >
    <template v-slot:header>
      <div class="tech-site-form__eyebrow">Новый сайт</div>
      <h2 class="tech-site-form__title font-heading">Добавление сайта</h2>
    </template>
    <TextField
      v-model="site.name"
      label="Название"
      placeholder="Например: phpMyAdmin"
      icon="mdi-label-outline"
      :disabled="isLoading"
      :error-messages="v.name.$errors.map((e: any) => e.$message)"
      :error="v.name.$error"
      @blur="v.name.$touch"
    />
    <TextField
      v-model="site.url"
      label="Адрес"
      placeholder="http://192.168.0.0"
      icon="mdi-link-variant"
      :disabled="isLoading"
      :error-messages="v.url.$errors.map((e: any) => e.$message)"
      :error="v.url.$error"
      @blur="v.url.$touch"
    />
    <TextField
      v-model="site.description"
      label="Описание"
      placeholder="Например: Управление базами данных"
      icon="mdi-text"
      :disabled="isLoading"
    />
    <TextField
      v-model="site.icon"
      label="Иконка (MDI)"
      placeholder="mdi-database"
      icon="mdi-emoticon-outline"
      :disabled="isLoading"
    />
  </BaseForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextField from '../inputs/TextField.vue';
import BaseForm from './BaseForm.vue';
import { useVuelidate } from '@vuelidate/core';
import { FormTypes } from '@/logic/types/FormTypes';
import type { TechSiteFormModel } from '@/logic/types/forms/TechSiteFormModel';
import { useTechSitesStore } from '@/store/techSitesStore';
import { techSiteRules } from '@/logic/validation/techSiteValidation';

defineProps<{ formType: FormTypes }>();
const emit = defineEmits(['cancel']);

const store = useTechSitesStore();
const isLoading = ref(false);
const site = ref<Partial<TechSiteFormModel>>({
  name: '',
  url: '',
  description: '',
  icon: 'mdi-web',
});

const v = useVuelidate(techSiteRules, site);

const onSubmitForm = async () => {
  if (isLoading.value) return;
  if (!(await v.value.$validate())) return;
  isLoading.value = true;
  try {
    await store.createSite({
      name: site.value.name!,
      url: site.value.url!,
      icon: site.value.icon || undefined,
      description: site.value.description || undefined,
    });
    emit('cancel');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.tech-site-form {
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
    margin: 4px 0 0;
  }
}
</style>