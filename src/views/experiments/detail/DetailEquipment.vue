<template>
  <admin-table-page
    ref="equipmentTableRef"
    :columns="columns"
    :fetch-method="deviceApi"
    :tool-buttons="toolButtons"
    :action-column="actionColumn"
    :extra-query="{ experimentsid }"
    selectable="multiple"
    list-key="items"
    row-key="id"
  />
  <form-equipment v-model="showEquipmentForm" v-model:equipmentid="equipmentid"/>
  
</template>
<script setup>
import { AdminTablePage } from "admin-table-page";
import FormEquipment from "../forms/FormEquipment.vue";

import { computed, ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import { deviceApi, deleteDeviceApi } from "@/api/device";
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";
import useUserStore from '@/stores/user';

const equipmentid = ref();

const showEquipmentForm = ref(false);
const i18n = useI18n();
const experimentsid = inject("exid");


const doAdd = () => {
  showEquipmentForm.value = true;
}

const equipmentTableRef = ref();
const { systemConfirm } = useUtils();
const { user } = useUserStore();

const columns = computed(() => (
  ["id", "name", "type", "purpose", "index"].map(prop => ({
    prop,
    label: i18n.t(`device.${prop}`)
  }))
))

const toolButtons = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.newDevice"),
    icon: "Plus",
    type: "primary",
    onClick: doAdd
  }, {
    text: i18n.t("button.batchDelete"),
    icon: "Delete",
    type: "danger",
    onClick: handleBatchDelete
  }] : [];
});

const actionColumn = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.edit"),
    onClick: (row) => handleView(row.id)
  }, {
    text: i18n.t("button.delete"),
    onClick: (row) => handleDelete(row.id)
  }] : [];
})

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

const handleBatchDelete = () => {}


</script>
<style lang="scss">
@use "admin-table-page/style/index.scss";
</style>