<template>
  <el-checkbox-group 
    v-model="params.form.methods" 
  >
    <el-checkbox label="Basic plot" />
    <el-checkbox label="PSD" />
    <el-checkbox label="Topomap" />
    <el-checkbox label="Time-frequency" />
  </el-checkbox-group>
  <div>
    <el-row class="topomap" v-if="params.form.methods.includes('Topomap')">
      <el-col :span="12">
        <el-form-item label="Total images">
          <el-input value="10" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Interval">
          <el-input value="2"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
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
