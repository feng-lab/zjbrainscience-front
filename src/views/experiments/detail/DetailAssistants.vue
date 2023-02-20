<template>
  <admin-table-page
    ref="assistantTableRef"
    :columns="columns"
    :fetch-method="getTableData"
    :tool-buttons="toolButtons"
    :action-column="actionColumn"
    :elPaginationProps="{
      'page-size': pageSize
    }"
    selectable="multiple"
    list-key="items"
    row-key="id"
    :locale="locale"
  />
  <bs-dialog-form 
    v-model="showForm"
    :cu="false"
    :title="$t('button.newAssistants')"
    v-model:form="assistantForm"
    :form-submit-api="doFormSubmit"
    :form-rules="rules"
  >
    <el-form-item :label="$t('experiments.tab.assistant')" prop="assistant_ids">
      <el-select
        style="width: 100%"
        clearable
        multiple
        v-model="assistantForm.assistant_ids"
        remote
        :reserve-keyword="false"
        :loading="loading"
        filterable
        :remote-method="handleRemoteSearch"
        :placeholder="$t('placeholder.userSearch')"
      >
        <el-option
          v-for="option in options"
          :key="option.value"
          v-bind="option"
        />
      </el-select>

    </el-form-item>

  </bs-dialog-form>
  
</template>
<script setup>
import { AdminTablePage } from "admin-table-page";
import BsDialogForm from "@/components/BsDialogForm.vue";

import { ref, inject, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserSearch } from "@/compositions/useUserSearch";
import { useUtils } from "@/compositions/useUtils";
import { newAssistantsApi, deleteAssistantsApi, getAssistantsApi } from "@/api/assistants";
import { ElMessage } from "element-plus";
import useUserStore from "@/stores/user";
import { useTable } from "@/compositions/useTable";
import { useShowForm } from "@/compositions/useShowForm";
import { storeToRefs } from "pinia";
import useGlobalStore from "@/stores/global";

const i18n = useI18n();
const { systemConfirm } = useUtils();
const showAssistantForm = ref(false);
const experiment_id = inject("exid");
const { locale } = storeToRefs(useGlobalStore());

const assistantForm = ref({
  assistant_ids: [],
  experiment_id
});

const pageSize = ref(10);

const { options, loading, handleRemoteSearch } = useUserSearch();
const { user } = useUserStore();

const { showForm, handleShowForm } = useShowForm();

const { 
  tableRef:assistantTableRef, 
  columnConfirmAction,
  batchAction
} = useTable();

const deleteConfirm = i18n.t("assistants.deleteConfirm");

const columns = computed(() => (
  ["id", "username", "staff_id"].map(prop => ({
    prop,
    label: i18n.t(`user.${prop}`)
  }))
))


const toolButtons = computed(() => {
  return user.access_level > 10 ? [{
      text: i18n.t("button.newAssistants"),
      icon: "Plus",
      onClick: handleShowForm
    }, {
      text: i18n.t("button.batchDelete"),
      icon: "Delete",
      type: "danger",
      onClick: () => batchAction({
        method: deleteAssistantsApi,
        action: "delete",
        extraParams: { experiment_id },
        confirmMsg: deleteConfirm
      })
  }] : [];
})

const actionColumn = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.delete"),
    onClick: (row) => columnConfirmAction(
      deleteConfirm,
      deleteAssistantsApi,
      {
        experiment_id,
        ids: [row.id]
      },
      "delete"
    )
  }] : [];
})

const doFormSubmit = () => {
  console.log('submit', assistantForm.value)
  return newAssistantsApi({
    ...assistantForm.value
  }).then(()=> {
    assistantTableRef.value.reload();
  })
}

const handleClose = () => {
  assistantForm.value.assistant_ids.length = 0;
}

const rules = computed(() => ({
  assistant_ids: [{
    required: true, 
    message: i18n.t("valid.require", {action: i18n.t("action.select"), field: i18n.t("experiments.tab.assistant")}), 
    trigger: "change"
  }]
}))

const getTableData = () => {
  return getAssistantsApi(experiment_id).then(res => {
    const total = res.length;
    if(total > pageSize.value) {
      pageSize.value = total;
    }
    return {
      total,
      items: res
    }
  })
}

</script>

