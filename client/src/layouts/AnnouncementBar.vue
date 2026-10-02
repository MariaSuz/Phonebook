<template>
  <VSystemBar
    v-if="banner"
    :height="38"
    :order="-1"
    class="announcement-bar"
  >
    <AnnouncementStrip
      :phase="banner.phase"
      :message="banner.item.message"
      :period="formatPeriod(banner.item.startsAt, banner.item.endsAt)"
      :end-time="formatEndTime(banner.item.endsAt)"
      closable
      @close="closed.push(banner.item.id)"
    />
  </VSystemBar>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import AnnouncementStrip from '@/components/widgets/AnnouncementStrip.vue';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { formatEndTime, formatPeriod, getBannerPhase } from '@/logic/utils/announcementUtils';

const store = useAnnouncementsStore();
const closed = reactive<number[]>([]);

// самый ранний из подходящих анонсов;
const banner = computed(() =>
  store.current
    .map((item) => ({ item, phase: getBannerPhase(item) }))
    .filter((x) => x.phase && !(x.phase === 'upcoming' && closed.includes(x.item.id)))
    .sort((a, b) => +new Date(a.item.startsAt) - +new Date(b.item.startsAt))[0],
);

onMounted(() => store.getCurrent());
</script>

<style scoped lang="scss">
.announcement-bar {
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none;

  :deep(.strip) {
    width: 100%;
  }
}
</style>
