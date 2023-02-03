<template>
  <admin-table-page
    ref="subjectTableRef"
    :columns="columns"
    :tool-buttons="toolButtons"
    :action-column="actionColumn"
    :fetch-method="humanSubjectApi"
    :extra-query="{ experimentsid }"
    selectable="multiple"
    list-key="items"
    row-key="id"
  />
  <form-subject v-model="showSubjectForm" v-model:subjectid="viewSubject"/>
  
</template>
<script setup>
import { AdminTablePage } from "admin-table-page";
import FormSubject from '../forms/FormSubject.vue';

import { ref, computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import { humanSubjectApi, deleteHumanSubjectApi } from "@/api/subject"
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";
import useUserStore from '@/stores/user';

const showSubjectForm = ref(false);
const viewSubject = ref();
const i18n = useI18n();

const experimentsid = inject("exid");

const subjectTableRef = ref();
const { user } = useUserStore();


const doAdd = () => {
  showSubjectForm.value = true;
}

const { systemConfirm } = useUtils();

const toolButtons = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.newSubject"), 
    type: "primary",
    icon: "Plus",
    onClick: doAdd
  }, {
    text: i18n.t("button.batchDelete"),
    type: "danger",
    icon: "Delete",
    onClick: handleBatchDelete
  }] : [];
});

const columns = computed(() => (
  ["id", "gender", "birthdate", "blood"].map(prop => ({
    prop,
    label: i18n.t(`subject.${prop}`)
  }))
))

const actionColumn = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.edit"),
    onClick: (row) => handleView(row.id)
  }, {
    text: i18n.t("button.delete"),
    onClick: (row) => handleDelete(row.id)
  }] : [];
})

const handleView = (subjectid) => {
  showSubjectForm.value = true;
  viewSubject.value = subjectid;
}

const handleDelete = (subjectid) => {
  systemConfirm(
    i18n.t("subject.deleteConfirm", {
      id: subjectid
    }),
    async () => {
      await deleteHumanSubjectApi({
        experimentsid,
        subjectid
      });
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
      tableRef.value.reload();
    }
  )
}

const handleBatchDelete = () => {

}

</script>
<style lang="scss">
@use "admin-table-page/style/index.scss";
</style>