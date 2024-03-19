<template>
  <bs-dialog-form 
    :title="$t('visualization.module.subpage')"
    :form-rules="rules"
    v-model:form="subpageForm"
    :form-model="subpageForm"
    :form-detail-api="handleDetail"
  > 
    <el-form-item :label="$t('visualization.subpage.name')" prop="name"> 
      <el-input v-model="subpageForm.name"/>
    </el-form-item>
    <el-form-item :label="$t('visualization.subpage.title')" prop="title"> 
      <el-input v-model="subpageForm.title"/>
    </el-form-item>
    <el-form-item :label="$t('visualization.subpage.resolution')" prop="resolution" class="is-required"> 
      <span class="space-evenly-flex"> 
      <el-input v-model.number="subpageForm.x_resolution" placeholder="x"/>
      <span class="m-r-20 m-l-20">-</span>
      <el-input v-model.number="subpageForm.y_resolution" placeholder="y"/>
      <span class="m-r-20 m-l-20">-</span>
      <el-input v-model.number="subpageForm.z_resolution" placeholder="z"/>
      </span>
    </el-form-item>
  </bs-dialog-form>
  
</template>
<script setup>
import { ref } from "vue";
const subpageForm = ref({
  name: "",
  title: "",
  x_resolution: 1,
  y_resolution: 1,
  z_resolution: 1,
  neuroDataLayout: "4panel"
})
const checkResulution = (rule, value, callback) => {
  const { x_resolution:x, y_resolution:y, z_resolution:z } = subpageForm.value;
  if(x < 1) {
    callback(new Error('X resolution is required'));
    return;
  }
  if(y < 1) {
    callback(new Error('Y resolution is required'))
    return;
  }
  if(z < 1) {
    callback(new Error('Z resolution is required'))
    return;
  }
  if(typeof x === "string" || typeof y === "string" || typeof z === "string") {
    callback(new Error('resolution must be number'));
    return;
  }
  callback();
}
const rules = ref({
  name: [{ 
    required: true, 
    trigger: ["blur", "change"], 
    message: "directory name for subpage is need"
  }],
  title: [{ required: true, trigger: ["blur", "change"]}],
  resolution: [{
    validator: checkResulution,
    trigger: ["blur", "change"]
  }]
})

const handleDetail = async (id) => {
  return {
    id,
    name: "default",
    title: "Default",
    x_resolution: 1000,
    y_resolution: 1000,
    z_resolution: 1000,

  }
}


</script>