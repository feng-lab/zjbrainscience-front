<template>
  <experiments-associate
    ref="equipmentRef"
    :columns="columns"
    i18n-prefix="device"
    :add-button-text="$t('button.newDevice')"
    :search-fields="searchFields"
    :list-api="devicesApi"
    :delete-api="deleteDeviceApi"
    :disassociate-api="disassociateDeviceApi"
    :associate-api="associateDeviceApi"
    list-path="/experiments/equipment"
    batchKey="device_ids"
    @show-new-form="() => showEquipmentForm = true"
    @view-detail="handleView"
  >
    <equipment-form
      v-model="showEquipmentForm" 
      v-model:id="equipmentid" 
      @submit-success="() => equipmentRef.reloadTable()"
    />
  </experiments-associate>
  
</template>
<script setup>
import EquipmentForm from "./EquipmentForm.vue";
import ExperimentsAssociate from "../experiments/ExperimentsAssociate.vue";

import { ref, computed } from "vue";
import { 
  devicesApi, 
  deleteDeviceApi, 
  associateDeviceApi, 
  disassociateDeviceApi 
} from "@/api/device";
import { useI18n } from "vue-i18n";

const equipmentid = ref();
const showEquipmentForm = ref(false);
const equipmentRef = ref();
const i18n = useI18n();

const columns = ["id", "name", "brand", "purpose", "index"];

const searchFields = computed(() =>  
  ["name", "brand"].map(name => ({
    name,
    label: i18n.t(`device.${name}`)
  }))
)


const handleView = (showId) => {
  showEquipmentForm.value = true;
  equipmentid.value = showId;
}
</script>