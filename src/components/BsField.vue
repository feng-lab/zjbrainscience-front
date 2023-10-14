<template>
  <div class="bs-field">
    <span class="bs-field-label" :style="{width: labelWidth}" v-if="label">{{ label }}{{ $t("colon")}}</span>
    <div class="bs-field-content" :style="`width: calc(100% - ${labelWidth})`">
    <slot></slot>
    </div>
  </div>
</template>
<script setup>
defineProps({
  label: String,
  labelWidth: {
    type: String,
    default: "80px"
  }
})
</script>
<style lang="scss" scoped>
.bs-field {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  &-label{
    text-align: end;
    margin-right: 8px;
  }
  @media only screen and (max-width: 426px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    &-label {
      text-align: start;
      width: 100%!important;
      margin-bottom: 4px;
    }
    &-content {
      width: 100%!important;
    }
  }
}
</style>