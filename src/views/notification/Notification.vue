<template>
  <admin-table-page
    ref="tableRef"
    :columns="columns"
    :locale="locale"
    :fetch-method="notifyByPageApi"
    :search-fields="searchFields"
    :tool-buttons="toolButtons"
    selectable="multiple"
    @select-change="handleSelectChange"
    row-key="id"
    list-key="items"
  >
    <template #type="{row}"> 
      {{ $t(`notify.type.${row.type}`) }}
    </template>
    <template #content="{row}">
      {{ 
          row.type === "task_step_status" ? 
          $t(`notify.content.${row.type}`, {
            id: row.content.task_id,
            name: row.content.task_name,
            status: STEP_INFO[row.content.task_status].status
          }) : row.content
      }}
    </template>
    <template #status="{row}">
      <el-tag 
        :type="row.status === 'read' ? 'success' : 'blue'"
      >
        {{$t(`notify.status.${row.status}`)}}
      </el-tag>
    </template>
    <template #actions="{row}"> 
      <el-button 
        type="primary"
        size="small"
        link 
        :disabled="row.status === 'read'"
        @click="() => handleMark('mark', [row.id])"
      >{{$t("notify.action.mark")}}</el-button>
      <el-divider direction="vertical" class="hidden-xs-only"/>
      <el-button 
        type="primary"
        size="small"
        link 
        :disabled="row.type !== 'task_step_status'"
        @click="handleViewNotify(row)"
      >{{$t("button.view")}}</el-button>

    </template>
  </admin-table-page>
  
</template>

<script setup>
import { AdminTablePage } from "admin-table-page";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import useGlobalStore from "@/stores/global";
import { storeToRefs } from "pinia";
import { notifyByPageApi } from "@/api/notification";
import { STEP_INFO } from "@/utils/common";
import { markToRead } from "@/api/notification";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useNotification } from "@/compositions/useNotification";

const tableRef = ref();
const i18n = useI18n();
const { locale } = storeToRefs(useGlobalStore());
const waitToMark = ref([]);
const router = useRouter();

const columns = computed(() => (
  ["type", "content", "status", "creator", "create_at"].map( prop => ({
    prop,
    label: i18n.t(`notify.list.${prop}`)
  }))
))

const searchFields = computed(() => ([{
  name: "type",
  label: i18n.t("notify.list.type")
}, {
  name: "status",
  label: i18n.t("notify.list.status"),
  searchType: "select",
  options: [{
    value: "read", 
    label: i18n.t("notify.status.read")
  }, {
    value: "unread",
    label: i18n.t("notify.status.unread")
  }]
}]))

const toolButtons = computed(() => ([{
  text: i18n.t("notify.action.batchMark"),
  disabled: !waitToMark.value.length,
  onClick: () => {
    const notification_ids = waitToMark.value.map(notify => notify.id);
    handleMark("batchMark", notification_ids);
  }
}, {
  text: i18n.t("notify.action.allMark"),
  onClick: () => handleMark("allMask")
}]))

const { handleMarkNotify, handleViewNotify } = useNotification();

const handleSelectChange = (rows) => {
  waitToMark.value = rows.filter(notify => notify.status === 'unread');
}

const handleMark = async (action, notification_ids) => {
  await handleMarkNotify(action, notification_ids);
  if(action === "batch") {
    tableRef.value.clearSelection();
  }
  tableRef.value.reload();
}


</script>
<style lang="scss">
@use "admin-table-page/style/index.scss";
</style>