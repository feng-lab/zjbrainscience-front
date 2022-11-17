<template>
  <el-checkbox-group 
    v-model="params.form" 
    @change="handleChange"
  >
    <el-checkbox label="Basic plot" />
    <el-checkbox label="PSD" />
    <el-checkbox label="Topomap" />
    <el-checkbox label="Time-frequency" />
  </el-checkbox-group>
  <div class="error" v-if="validating && !params.form.length">
    {{ $t("valid.checked") }}
  </div>
</template>
<script setup>

defineProps({
  params: Object,
  validating: Boolean
})


</script>

<style lang="scss" scoped>
.error {
  color: var(--el-color-danger);
  zoom: .85;
  line-height: 1;
}
</style>
