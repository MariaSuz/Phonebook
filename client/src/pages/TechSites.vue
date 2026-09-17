<template>
  <div class="tech-sites">
    <Breadcrumbs current="Технические сайты" />
    <div class="tech-sites__header">
      <h1 class="tech-sites__title font-heading">Технические сайты</h1>
    </div>
    <div class="tech-sites__grid">
      <div
        v-for="site in sites"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Breadcrumbs from '@/components/buttons/Breadcrumbs.vue';

interface TechSite {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

const sites = computed<TechSite[]>(() => [
  {
    id: '1',
    name: '#',
    url: '#',
    icon: 'mdi-database',
    description: '#',
  },
  {
    id: '2',
    name: '#',
    url: '#',
    icon: 'mdi-database',
    description: '#',
  },
]);

const displayUrl = (url: string) => url.replace(/^https?:\/\//, '');

const openSite = (site: TechSite) => {
  window.open(site.url, '_blank', 'noopener');
};
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
