<template>
  <div class="phone-book-loader">
    <div
      v-for="n in 2"
      :key="n"
      class="phone-book-skeleton-card"
    >
      <VProgressLinear
        indeterminate
        color="primary"
        height="3"
        absolute
        location="top"
      />
      <div class="phone-book-skeleton-card__header">
        <div class="phone-book-skeleton-card__header-left">
          <VIcon
            icon="mdi-chevron-down"
            color="primary"
            size="small"
          />
          <SkeletonLoader
            width="180px"
            height="16px"
          />
          <SkeletonLoader
            width="60px"
            height="14px"
          />
        </div>
        <SkeletonLoader
          width="170px"
          height="32px"
        />
      </div>
      <table class="phone-book-skeleton-table">
        <thead>
          <tr>
            <th
              v-for="col in skeletonColumns"
              :key="col.key"
              :style="{ width: col.width }"
            >
              {{ col.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in 4"
            :key="row"
          >
            <td
              v-for="col in skeletonColumns"
              :key="col.key"
            >
              <SkeletonLoader :width="col.widths[row - 1]" />
            </td>
            <td class="phone-book-skeleton-table__actions">
              <SkeletonLoader
                v-for="i in 3"
                :key="i"
                width="20px"
                height="20px"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonLoader from '@/components/SkeletonLoader.vue';

const skeletonColumns = [
  { key: 'cabinet', title: 'Кабинет', width: '80px', widths: ['50%', '65%', '40%', '55%'] },
  { key: 'position', title: 'Должность', width: '180px', widths: ['85%', '60%', '90%', '70%'] },
  { key: 'fullName', title: 'Ф.И.О', width: '340px', widths: ['65%', '75%', '55%', '80%'] },
  { key: 'internalPhone', title: 'Внутренний', width: '100px', widths: ['45%', '55%', '35%', '50%'] },
  { key: 'cityPhone', title: 'Городской', width: '200px', widths: ['70%', '50%', '80%', '60%'] },
  { key: 'mobilePhone', title: 'Сотовый номер', width: '200px', widths: ['75%', '65%', '85%', '55%'] },
  { key: 'email', title: 'Почта', width: '200px', widths: ['90%', '70%', '95%', '65%'] },
];
</script>

<style lang="scss">
@import '@/styles/colors';

.phone-book-loader {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.phone-book-skeleton-card {
  position: relative;
  border: 1px solid $color-line;
  border-radius: 4px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 15px;
    border-bottom: 1px solid $color-line;
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 14px 15px;
    border-bottom: 1px solid $color-line;

    &:last-child {
      border-bottom: none;
    }
  }
}

.phone-book-skeleton-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $color-secondary-text;
    padding: 12px 15px;
    border-bottom: 1px solid $color-line;
    background: rgb(var(--v-theme-background));
  }

  td {
    padding: 14px 15px;
    border-bottom: 1px solid $color-line;
  }

  tr:last-child td {
    border-bottom: none;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;

    .skeleton-block {
      border-radius: 4px;
    }
  }
}
</style>
