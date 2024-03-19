<template>
  <bs-dialog-form
    v-model:form="dataForm"
    :form-model="dataForm"
    :title="$t('visualization.module.data')"
    :form-detail-api="handleDetail"
  > 
    <el-form-item :label="$t('visualization.data.label')" prop="label" required>
      <el-input v-model="dataForm.label"/>
    </el-form-item>
    <el-form-item :label="$t('visualization.data.url')" prop="url">
      <el-input v-model="dataForm.url"/>
    </el-form-item>
  </bs-dialog-form>
</template>
<script setup>
import { ref } from "vue";
const dataForm = ref({
  label: "",
  url: ""
})

const handleDetail = (id) => {
  return {
    label: "Brain Regions",
    url: "precomputed://"
  }
}

</script>