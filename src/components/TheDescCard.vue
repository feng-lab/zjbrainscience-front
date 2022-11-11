<template>
  <div class="display">
    <div class="display--icon">
      <el-icon :color="iconColor"><component :is="icon"/></el-icon>
    </div>
    <div class="display--title">{{ title }}</div>
    <div class>{{ desc }}</div>
  </div>
</template>
<script setup>
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
  &--icon {
    font-size: 36px;
  }
  &--title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}
</style>