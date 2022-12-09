<template>
  <bs-dialog-form
    :form-model="equipmentForm"
    :do-form-submit="handleSubmit"
    :on-close="handleClose"
    :title="title"
  >
    <el-form-item :label="$t('device.id')" prop="equipmentid">
      <el-input 
        v-model="equipmentForm.equipmentid"
      />
    </el-form-item>
    <el-form-item :label="$t('device.name')" prop="name">
      <el-input 
        v-model="equipmentForm.name"
      />
    </el-form-item>
    <el-form-item :label="$t('device.type')" prop="brand">
      <el-input 
        v-model="equipmentForm.brand"
      />
    </el-form-item>
    <el-form-item :label="$t('device.purpose')" prop="purpose">
      <el-input 
        v-model="equipmentForm.purpose"
      />
    </el-form-item>
    <el-form-item :label="$t('device.index')" prop="index">
      <el-input 
        v-model="equipmentForm.index"
      />
    </el-form-item>
  </bs-dialog-form>
</template>
<script setup>
import BsDialogForm from '@/components/BsDialogForm.vue';

import { ref, inject, computed, watch } from "vue";
import { 
  deviceDetailApi, 
  newDeviceApi, 
  updateDeviceApi 
} from "@/api/device";
import { useI18n } from "vue-i18n";

const props = defineProps({
  equipmentid: [String, Number]
})

const experimentsid = inject("exid");

const equipmentForm = ref({
  equipmentid: "",
  name: "",
  brand: "",
  purpose: "",
  index: "",
});

const emits = defineEmits(["update:equipmentid"])
const i18n = useI18n();

const type = ref("new");

const title = computed(() => {
  let res = `${i18n.t(`button.${type.value}`)}${i18n.t('device.text')}`;
  if(type.value === "edit") {
    res += ` (ID: ${props.equipmentid})`
  }
  return res;
})

watch(
  () => props.equipmentid,
  async (equipmentid) => {
    if(equipmentid) {
      console.log('set type to edit')
      type.value = "edit";
      equipmentForm.value = await deviceDetailApi({ 
        experimentsid,
        equipmentid
      })
    }
  }
)

const handleSubmit = () => {
  const method = type.value === "edit" ? updateDeviceApi : newDeviceApi; 
  return method(equipmentForm.value)
}

const handleClose = () => {
  type.value = "new";
  emits("update:equipmentid", null);
}

</script>