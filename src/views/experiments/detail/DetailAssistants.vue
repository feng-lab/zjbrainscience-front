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
  />
  <bs-dialog-form 
    v-model="showAssistantForm"
    :form-model="assistantForm"
    :do-form-submit="doFormSubmit"
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

import { ref, inject, computed, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useUserSearch } from "@/compositions/useUserSearch";
import { useUtils } from "@/compositions/useUtils";
import { newAssistantsApi, deleteAssistantsApi, getAssistantsApi } from "@/api/assistants";
import { ElMessage } from "element-plus";

const i18n = useI18n();
const { systemConfirm } = useUtils();
const showAssistantForm = ref(false);
const experiment_id = inject("exid");

const assistantForm = ref({
  assistant_ids: [],
  experiment_id
});

const pageSize = ref(10);

const { options, handleRemoteSearch } = useUserSearch();

const assistantTableRef= ref();
const columns = computed(() => (
  ["id", "username", "staff_id"].map(prop => ({
    prop,
    label: i18n.t(`user.${prop}`)
  }))
))


const toolButtons = computed(() => ([{
  text: i18n.t("button.newAssistants"),
  onClick: () => {
    showAssistantForm.value = true;
  }
}, {
  text: i18n.t("button.batchDelete"),
  type: "danger",
  onClick: async () => {
    const assistant_ids = assistantTableRef.value.getSelections().map(assistant => assistant.id);
    await deleteAssistants(assistant_ids);
    assistantTableRef.value.clearSelection();
  }
}]))

const actionColumn = computed(() => ([{
  text: i18n.t("button.delete"),
  onClick: (row) => {
    deleteAssistants([row.id]);
  }
}]))

const deleteAssistants = async (assistant_ids) => {
  if(!assistant_ids.length) return;
  systemConfirm(
    i18n.t("assistants.deleteConfirm"),
    async () => {
      await deleteAssistantsApi({
        experiment_id,
        assistant_ids
      });
      assistantTableRef.value.reload();
      ElMessage.success(i18n.t("elmessage.deleteSuccess"));
    }
  )
}




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


<style lang="scss">
@use "admin-table-page/style/index.scss";
</style>