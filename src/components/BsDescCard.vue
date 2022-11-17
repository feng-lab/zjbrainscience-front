<template>
  <div class="display">
    <div class="display--icon">
      <bs-icon-img 
        :icon-color="iconColor" 
        :icon="icon"
        :size="36"
      />
    </div>
    <div class="display--title">{{ title }}</div>
    <div class>{{ desc }}</div>
  </div>
</template>
<script setup>
import BsIconImg from "@/components/BsIconImg.vue";
defineProps({
  title: String,
  desc: String,
  icon: String,
  iconColor: String,
  height: String
})
</script>
<style scoped lang="scss">
.display {
  color: var(--el-text-color-regular);
  background-color: #F2F3F5;
  padding: 24px;
  height: 100%;
  &--title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}
</style>