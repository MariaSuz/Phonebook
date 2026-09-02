<template>
  <Transition name="slide-down">
    <div
      v-if="modelValue"
      class="tech-sites"
      v-click-outside="closePanel"
    >
      <div class="tech-sites__header">
        <span class="tech-sites__header-title">
          Технические сайты
        </span>
        <div class="tech-sites__header-actions">
          <VBtn
          icon="mdi-close"
          variant="text"
          size="small"
          class="tech-sites__header-close"
          @click="closePanel"
          />
        </div>
      </div>
      <div class="tech-sites__content">
        <div class="tech-sites__grid">
          <div
            v-for="site in sites"
            :key="site.id"
            class="site-card"
            @click="openSite(site)"
          >
            <div class="site-card__preview">
              <VIcon
                :icon="site.icon || 'mdi-web'"
                size="32"
                color="#B22222"
              />
            </div>
            <div
              class="site-card__name"
              :title="site.name"
            >
              {{ site.name }}
            </div>
            <div class="site-card__description">
              {{ site.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface TechSite {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
}
interface techProps {
  modelValue: boolean;
}

const props = defineProps<techProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const closePanel = () => {
  emit('update:modelValue', false);
};

const openSite = (site: TechSite) => {
  window.open(site.url, '_blank', 'noopener,noreferrer');
};

const sites = computed<TechSite[]>(() => {
  return [
    {
      id: '1',
      name: '#',
      url: '#',
      icon: 'mdi-database',
      description: '#'
    },
    {
      id: '2',
      name: '#',
      url: '#',
      icon: 'mdi-database',
      description: '#'
    },
  ];
});
</script>
<style scoped lang="scss">
.tech-sites {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 10px 30px rgba(114, 47, 55, 0.25);
  z-index: 1000;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: linear-gradient(135deg, #722F37, #B22222);
    &-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: white;
      margin: 0;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    &-actions {
      display: flex;
      gap: 8px;
    }
    &-close {
      color: white !important;
      background: rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
      &:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        transform: scale(1.05);
      }
    }
  }
  &__content {
    padding: 24px;
    min-height: 200px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 140px));
    gap: 20px;
    justify-content: center;
    justify-items: center;
    margin: 0 auto;
    width: 100%;
  }
  .site-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 130px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-4px);

      .site-card__preview {
        background: #f5f0f0;
        border-color: #C06060;
      }
    }

    &__preview {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      background: #fafafa;
      border: 2px solid #e5e5e5;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      margin-bottom: 8px;
    }

    &__name {
      font-size: 0.8rem;
      font-weight: 500;
      color: #333;
      text-align: center;
      word-break: break-word;
      max-width: 100%;
      line-height: 1.3;
      margin-top: 4px;
    }

    &__description {
      font-size: 0.7rem;
      color: #666;
      text-align: center;
      margin-top: 4px;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
/* Анимация */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
