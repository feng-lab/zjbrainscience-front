<template>
  <bs-dialog-form
    :form-model="equipmentForm"
    :do-form-submit="handleSubmit"
    :on-close="handleClose"
    :title="title"
  >
    <el-form-item :label="$t('device.name')" prop="name">
      <el-input 
        v-model="equipmentForm.name"
      />
    </el-form-item>
    <el-form-item :label="$t('device.brand')" prop="brand">
      <el-input 
        v-model="equipmentForm.brand"
      />
    </el-form-item>
    <el-form-item :label="$t('device.purpose')" prop="purpose">
      <el-input 
        v-model="equipmentForm.purpose"
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
  id: [String, Number]
})

const experiment_id = inject("exid", null);

const equipmentForm = ref({
  name: "",
  brand: "",
  purpose: "",
});

const emits = defineEmits(["update:id", "afterAdd"])
const i18n = useI18n();

const type = ref("new");

const title = computed(() => {
  let res = `${i18n.t(`button.${type.value}`)}${i18n.t('device.text')}`;
  if(type.value === "edit") {
    res += ` (ID: ${props.id})`
  }
  return res;
})

watch(
  () => props.id,
  async (id) => {
    if(id) {
      type.value = "edit";
      equipmentForm.value = await deviceDetailApi(id)
    }
  }
)

const handleSubmit = () => {
  const method = type.value === "edit" ? updateDeviceApi : newDeviceApi; 
  return method({
    ...equipmentForm.value,
    experiment_id
    }).then(() => {
    emits("afterAdd");
  })
}

const handleClose = () => {
  type.value = "new";
  emits("update:id", null);
}

</script>