<template>
  <admin-table-page
    ref="tableRef"
    :columns="columns"
    :fetch-method="listApi"
    :tool-buttons="toolButtons"
    :action-column="actionColumn"
    :extra-query="{ experiment_id }"
    :search-fields="searchFields"
    :action-column-props="actionColumnProps"
    selectable="multiple"
    list-key="items"
    :row-key="idKey"
    :locale="locale"
  >
    <template #tips>
      <el-alert 
        show-icon
        v-if="linkEx"
        :title="$t('associate.selectFromTips', {id: linkEx, item: $t(`${i18nPrefix}.text`)})"
        type="warning"
        :closable="false"
        class="m-b-8"
      />
    </template>
    <template #extra_columns>
      <slot name="table"/>
    </template>
  </admin-table-page>
  <slot/>
  <bs-new-from 
    :virtual-ref="newFromSelectBtnRef"
    :select-text="$t('associate.newfrom.select', { item: $t(`${i18nPrefix}.text`) })"
    :add-text="$t('associate.newfrom.add', { item: $t(`${i18nPrefix}.text`) })"
    @new-from-add="handleNewForm"
    @new-from-select="handleSelectFrom"
  />
  
</template>
<script setup>
import { AdminTablePage } from "admin-table-page";
import BsNewFrom from "@/components/BsNewFrom.vue";
import BsIconDisconnection from "@/components/icons/BsIconDisConnection.vue";

import useUserStore from '@/stores/user';
import useGlobalStore from "@/stores/global";
import { computed, ref, inject } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useTable } from "@/compositions/useTable";

const props = defineProps({
  columns: Array,
  searchFields: [Array, Object],
  i18nPrefix: String,
  addButtonText: String,
  listApi: Function,
  deleteApi: Function,
  disassociateApi: Function,
  associateApi: Function,
  listPath: String,
  actionColumnProps: Object,
  idKey: {
    type: String,
    default: "id"
  }
});

const emits = defineEmits(["viewDetail", "showNewForm"]);
const experiment_id = inject("exid", null);

const i18n = useI18n();
const router = useRouter();
const { user } = useUserStore();
const { locale } = storeToRefs(useGlobalStore());
const newFromSelectBtnRef = ref();

const { 
  tableRef,
  columnAction,
  columnConfirmAction,
  batchAction
} = useTable(props.idKey);

const deleteConfirmMsg = i18n.t("associate.confirm.delete", { item: i18n.t(`${props.i18nPrefix}.text`) });
const disassociateConfirmMsg = i18n.t("associate.confirm.disassociate", { item: i18n.t(`${props.i18nPrefix}.text`) });

const linkEx = computed(() => {
  return router.currentRoute.value.query?.linkEx;
})



const columns = computed(() => (
  props.columns.map(prop => ({
    prop,
    label: i18n.t(`${props.i18nPrefix}.${prop}`)
  }))
))

const toolButtons = computed(() => {
  return user.access_level > 10 ? [{
    text: props.addButtonText,
    icon: "Plus",
    type: "primary",
    ref: newFromSelectBtnRef,
    show: !!experiment_id,
  }, {
    text: props.addButtonText,
    icon: "Plus",
    type: "primary",
    show: !experiment_id,
    onClick: handleNewForm
  }, {
    text: i18n.t("button.linkToExperiment"),
    show: !experiment_id,
    icon: "Connection",
    onClick: () => handleAssociate(false)
  }, {
    text: i18n.t("button.batchDisassociate"),
    show: !!experiment_id,
    icon: BsIconDisconnection,
    type: "danger",
    onClick: () => batchAction({
      method: props.disassociateApi,
      extraParams: { experiment_id },
      confirmMsg: disassociateConfirmMsg,
      action: "disassociate"
    })
  }, {
    text: i18n.t("button.batchDelete"),
    icon: "Delete",
    type: "danger",
    onClick: () => batchAction({
      method: props.deleteApi, 
      action: "delete", 
      confirmMsg:  deleteConfirmMsg
    })
  }] : [];
});

const actionColumn = computed(() => {
  return user.access_level > 10 ? [{
    text: i18n.t("button.edit"),
    onClick: (row) => handleView(row[props.idKey])
  },{
    show: !experiment_id,
    text: i18n.t("button.linkToExperiment"),
    icon: "Link",
    onClick: (row) => handleAssociate(true, row[props.idKey])
  }, {
    text: i18n.t("button.disassociate"),
    show: !!experiment_id,
    onClick: (row) => columnConfirmAction(
      disassociateConfirmMsg, 
      props.disassociateApi, 
      { 
        experiment_id,
        ids: [row[props.idKey]]
      }, 
      "disassociate"
    )
  }, {
    text: i18n.t("button.delete"),
    onClick: (row) => columnConfirmAction(deleteConfirmMsg, props.deleteApi, { ids: [row[props.idKey]] }, "delete")
  }] : [];
})

const searchFields = computed(() => {
  return experiment_id ? [] : props.searchFields;
})

const handleSelectFrom = () => {
  router.push({ path: props.listPath, query: { linkEx: experiment_id}});
}

const handleNewForm = () => {
  emits("showNewForm", { 
    showForm: true, 
    isAssociate: !!experiment_id
  });
}

const handleView = (showId) => {
  console.log('show-id', showId)
  emits("viewDetail", showId);
}

const handleAssociate = async (isSingle, id) => {
  let exid = linkEx.value || experiment_id;
  if(!exid) {
    await ElMessageBox.prompt(i18n.t("associate.inputExId"), i18n.t("button.linkToExperiment"), {
      confirmButtonText: i18n.t("button.submit"),
      cancelButtonText: i18n.t("button.cancel")
    }).then(({ value }) => {
      exid = Number(value);
    })
  }
  if(isSingle) {
    columnAction(props.associateApi, {
      experiment_id: exid,
      ids: [id],
    }, "associate")
  } else {
    await batchAction({
      method: props.associateApi,
      extraParams: { experiment_id: exid },
      needConfirm: false,
      action: "associate"
    });
    if(linkEx.value) {
      router.push(`/experiments/detail/${linkEx.value}/${props.i18nPrefix}`)
    }
  }
}

defineExpose({
  reloadTable: () => tableRef.value.reload(),
  handleAssociate: handleAssociate
})

</script>