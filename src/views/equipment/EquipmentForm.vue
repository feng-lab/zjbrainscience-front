<template>
  <bs-dialog-form
    v-model:form="equipmentForm"
    :form-model="equipmentForm"
    :form-submit-api="newEquipmentApi"
    :form-update-api="updateEquipmentApi"
    :form-detail-api="equipmentDetailApi"
    :title="$t('equipment.text')"
  >
    <el-form-item :label="$t('equipment.name')" prop="name">
      <el-input 
        v-model="equipmentForm.name"
      />
    </el-form-item>
    <el-form-item :label="$t('equipment.brand')" prop="brand">
      <el-input 
        v-model="equipmentForm.brand"
      />
    </el-form-item>
    <el-form-item :label="$t('equipment.purpose')" prop="purpose">
      <el-input 
        v-model="equipmentForm.purpose"
      />
    </el-form-item>
  </bs-dialog-form>
</template>
<script setup>
import BsDialogForm from '@/components/BsDialogForm.vue';

import { ref } from "vue";
import { 
  equipmentDetailApi,
  newEquipmentApi,
  updateEquipmentApi
} from "@/api/equipment";

const equipmentForm = ref({
  name: "",
  brand: "",
  purpose: "",
});


</script>