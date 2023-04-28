<template>
  <div class="bs-field">
    <span class="bs-field-label">{{ label }}{{ $t("colon")}}</span>
    <div class="bs-field-content">
    <slot></slot>
    </div>
  </div>
</template>
<script setup>
defineProps({
  label: String
})
</script>
<style lang="scss" scoped>
.bs-field {
  display: flex;
  align-items: center;
  justify-content: end;
  &-label{
    width: 120px;
    text-align: end;
    margin-right: 8px;
  }
  &-content{
    width: 100%;
    :deep(.el-input) {
      width: 100%;
    }
  }
}
</style>