import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUtils } from "./useUtils";

export function useTable() {
  const tableRef = ref();
  const { systemConfirm } = useUtils();
  const i18n = useI18n();
  const columnAction = async (method, params, action) => {
    await method(params);
    ElMessage.success(i18n.t(`elmessage.${action}Success`));
    tableRef.value.reload();
  }
  const columnConfirmAction = (confirmMsg, method, params, action) => {
    systemConfirm(
      confirmMsg,
      () => columnAction(method, params, action)
    )
  }
  const batchAction = ({
    method, 
    action, 
    extraParams={}, 
    idsKey="ids", 
    needConfirm=true, 
    confirmMsg=""
  }) => {
    const ids = tableRef.value.getSelections().map(item => item.id);
    if(!ids.length) {
      ElMessage.warning(i18n.t("valid.checked"));
      return
    }
    const params = {
      ...extraParams,
      [idsKey]: ids
    }
    console.log('params', params)
    if(needConfirm) {
      columnConfirmAction(confirmMsg, method, params, action);
    } else {
      columnAction(method, params, action);
    }
    tableRef.value.clearSelection();
  }
  return {
    tableRef,
    columnAction,
    columnConfirmAction,
    batchAction
  }
}