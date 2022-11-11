<template>
  <TheTable
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
  </TheTable>
  <FormSubject v-model="showSubjectForm" v-model:subjectid="viewSubject"/>
  
</template>
<script setup>

import { reactive, ref, computed, inject } from "vue";
import TheTable from '@/components/TheTable.vue';
import FormSubject from '../forms/FormSubject.vue';
import { useI18n } from "vue-i18n";
import { humanSubjectApi, delHumanSubjectApi } from "@/api/subject"
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
  label: i18n.t("term.operation")
}]));


const handleView = (subjectid) => {
  showSubjectForm.value = true;
  viewSubject.value = subjectid;
}

const handleDelete = (subjectid) => {
  systemConfirm(
    i18n.t("experiments.deleteConfirm", {
      target: i18n.t("subject.text"),
      id: subjectid
    }),
    async () => {
      await delHumanSubjectApi({
        experimentsid,
        subjectid
      });
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
      tableRef.value.reload();
    }
  )
}

</script>