<template>
  <div class="tech-sites">
    <Breadcrumbs current="Технические сайты" />
    <div class="tech-sites__header">
      <h1 class="tech-sites__title font-heading">Технические сайты</h1>
      <ButtonComponent
        prepend-icon="mdi-plus"
        title="Добавить сайт"
        buttonType="save"
        @click="modals.add = true"
      />
    </div>
    <div
      v-if="!store.sites.length && !store.loading"
      class="tech-sites__empty"
    >
      <div class="tech-sites__empty-icon">
        <VIcon
          icon="mdi-view-agenda-outline"
          size="28"
          color="primary"
        />
      </div>
      <h3 class="tech-sites__empty-title font-heading">Сайтов пока нет</h3>
      <p class="tech-sites__empty-text">
        Здесь появятся ссылки на внутренние инструменты, когда их добавит администратор.
      </p>
    </div>
    <div class="tech-sites__grid">
      <div
        v-for="site in store.sites"
        :key="site.id"
        class="site-card"
        @click="openSite(site)"
      >
        <div class="site-card__icon">
          <VIcon
            :icon="site.icon || 'mdi-web'"
            size="22"
            color="primary"
          />
        </div>
        <div class="site-card__body">
          <div class="site-card__name">
            <span>{{ site.name }}</span>
            <VIcon
              icon="mdi-arrow-top-right"
              size="14"
              class="site-card__arrow"
            />
            <VIcon
              icon="mdi-delete"
              size="small"
              class="site-card__delete"
              @click.stop="askDelete(site)"
            />
          </div>
          <div
            v-if="site.description"
            class="site-card__description"
          >
            {{ site.description }}
          </div>
          <div class="site-card__url">{{ displayUrl(site.url) }}</div>
        </div>
      </div>
    </div>
    <FormModal
      v-model="modals.add"
      :form-component="TechSiteForm"
      :form-type="FormTypes.ADD"
      width="520"
      @cancel="modals.add = false"
    />
    <ComfirmDelete
      v-model="modals.delete"
      :title="siteToDelete?.name"
      @confirm="confirmDelete"
      @cancel="modals.delete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import TechSiteForm from '@/components/forms/TechSiteForm.vue';
import FormModal from '@/components/modals/FormModal.vue';
import ComfirmDelete from '@/components/modals/ComfirmDelete.vue';
import { FormTypes } from '@/logic/types/FormTypes';
import { useTechSitesStore } from '@/store/techSitesStore';
import type { TechSiteFormModel } from '@/logic/types/forms/TechSiteFormModel';
import { displayUrl } from '@/logic/utils/textUtils';

const store = useTechSitesStore();
const modals = reactive({ add: false, delete: false });
const siteToDelete = ref<TechSiteFormModel | null>(null);

const openSite = (site: TechSiteFormModel) => {
  window.open(site.url, '_blank', 'noopener');
};

const askDelete = (site: TechSiteFormModel) => {
  siteToDelete.value = site;
  modals.delete = true;
};

const confirmDelete = async () => {
  if (siteToDelete.value) await store.deleteSite(siteToDelete.value.id);
  modals.delete = false;
  siteToDelete.value = null;
};

onMounted(() => store.getSites());
</script>

<style scoped lang="scss">
@import '@/styles/colors';

.tech-sites {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary-text;
    margin: 0;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 48px 16px;
    &-icon {
      width: 56px;
      height: 56px;
      border-radius: 6px;
      background: $color-bg-muted;
      border: 1px solid $color-line;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    &-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: $color-primary-text;
      margin: 0 0 8px;
    }
    &--text {
    max-width: 380px;
    margin: 0;
    font-size: 0.9rem;
    color: $color-secondary-text;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
}

.site-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid $color-line;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgb(var(--v-theme-primary));

    .site-card__arrow {
      opacity: 1;
    }
  }

  &__delete {
    margin-left: auto;
    color: $color-muted;
    transition: color 0.2s ease;

    &:hover {
      color: rgb(var(--v-theme-error));
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background: $color-bg-muted;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__body {
    min-width: 0;
    flex: 1;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: $color-primary-text;
  }

  &__arrow {
    color: $color-muted;
    transition: color 0.2s ease;
  }

  &__description {
    font-size: 0.85rem;
    color: $color-secondary-text;
    margin-top: 2px;
  }

  &__url {
    font-size: 0.8rem;
    color: $color-muted;
    margin-top: 6px;
  }
}
</style>
