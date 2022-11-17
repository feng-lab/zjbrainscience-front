<template>
  <bs-table
    ref="tableRef"
    :columns="columns"
    :fetch-method="deviceApi"
    :button-list="buttonList"
  >
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="handleView(row.equipmentid)">{{ $t("button.edit") }}</el-button>
      <el-divider direction="vertical"/>
      <el-button link type="primary" size="small" @click="handleDelete(row.equipmentid)">{{ $t("button.delete") }}</el-button>
    </template>
  </bs-table>
  <form-equipment v-model="showEquipmentForm" v-model:equipmentid="equipmentid"/>
  
</template>
<script setup>
import BsTable from '@/components/BsTable.vue';
import FormEquipment from "../forms/FormEquipment.vue";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { deviceApi, deleteDeviceApi } from "@/api/device";
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";

const equipmentid = ref();

const showEquipmentForm = ref(false);
const i18n = useI18n();


const doAdd = () => {
  showEquipmentForm.value = true;
}

const tableRef = ref();
const { systemConfirm } = useUtils();


const buttonList = computed(() => ([{
  text: i18n.t("button.newDevice"),
  icon: "Plus",
  type: "primary",
  onClick: doAdd
}]))

const columns = computed(() => ([{
  prop: "equipmentid",
  label: i18n.t("device.id")
}, {
  prop: "name",
  label: i18n.t("device.name")
}, {
  prop: "brand",
  label: i18n.t("device.type")
}, {
  prop: "purpose",
  label: i18n.t("device.purpose")
}, {
  prop: "index",
  label: i18n.t("device.index")
}, {
  prop: "operation",
  slot: "operation",
  label: i18n.t("term.operation")
}]));

const handleView = (showId) => {
  showEquipmentForm.value = true;
  equipmentid.value = showId;
}

const handleDelete = (equipmentid) => {
  systemConfirm(
    i18n.t("device.deleteConfirm", {
      id: equipmentid
    }),
    async () => {
      await deleteDeviceApi({
        experimentsid,
        equipmentid
      });
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
      tableRef.value.reload();
    }
  )
}



</script>