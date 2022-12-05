<template>
  <bs-table
    ref="tableRef"
    :columns="columns"
    :button-list="buttonList"
    :fetch-method="humanSubjectApi"
    :query="{ experimentsid }"
  >
    <template #operation="{ row }">
      <el-button link type="primary" size="small" @click="handleView(row.subjectid)">{{ $t("button.edit") }}</el-button>
      <el-divider direction="vertical"/>
      <el-button link type="primary" size="small" @click="handleDelete(row.subjectid)">{{ $t("button.delete") }}</el-button>
    </template>
  </bs-table>
  <form-subject v-model="showSubjectForm" v-model:subjectid="viewSubject"/>
  
</template>
<script setup>
import BsTable from '@/components/BsTable.vue';
import FormSubject from '../forms/FormSubject.vue';

import { ref, computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import { humanSubjectApi, deleteHumanSubjectApi } from "@/api/subject"
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";

const showSubjectForm = ref(false);
const viewSubject = ref();
const i18n = useI18n();

const experimentsid = inject("exid");

const tableRef = ref();


const doAdd = () => {
  showSubjectForm.value = true;
}

const { systemConfirm } = useUtils();

const buttonList = computed(() => ([{
  text: i18n.t("button.new") + i18n.t("subject.text"),
  type: "primary",
  icon: "Plus",
  onClick: doAdd
}]))

const columns = computed(() => ([{
  prop: "subjectid",
  label: i18n.t("subject.id")
}, {
  prop: "gender",
  label: i18n.t("subject.gender")
}, {
  prop: "birthdate",
  label: i18n.t("subject.birthdate")
}, {
  prop: "abobloodtype",
  label: i18n.t("subject.blood")
}, {
  prop: "operation",
  slot: "operation",
  label: i18n.t("label.operation")
}]));


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

</script>