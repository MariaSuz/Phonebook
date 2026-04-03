<template>
  <VBtn
    @click="click"
    class="btn"
    :class="{
      'btn--save': buttonType === 'save',
      'btn--cancel': buttonType === 'cancel'
    }"
  > {{ title }}
  </VBtn>
</template>

<script setup lang="ts">
interface buttonProps {
  title?: string;
  buttonType?: 'save' | 'cancel';
}

const emit = defineEmits(['click']);
const props = defineProps<buttonProps>();

const click = () => {
  emit('click');
};

</script>

<style lang="scss">
.btn {
  border-radius: 30px !important;
  padding: 0 28px !important;
  height: 44px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
  color: #722F37 !important;
  &:hover {
    background: #FCE9E9 !important;
    box-shadow: 0 6px 14px rgba(114, 47, 55, 0.25) !important;
  }

  &--cancel {
    background: transparent !important;
    color: #722F37 !important;
    border: 1px solid #C06060 !important;

    &:hover {
      background: #FCE9E9 !important;
      border-color: #B22222 !important;
      color: #B22222 !important;
    }
  }

  &--save {
    background: linear-gradient(135deg, #722F37, #B22222) !important;
    color: white !important;
    border: none !important;
    box-shadow: 0 4px 12px rgba(178, 34, 34, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, #B22222, #722F37) !important;
      box-shadow: 0 6px 16px rgba(178, 34, 34, 0.4) !important;
    }
  }
}
</style>
