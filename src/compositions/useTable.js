import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUtils } from "./useUtils";

export function useTable(idKey) {
  const tableRef = ref();
  const { systemConfirm } = useUtils();
  const i18n = useI18n();
  const columnAction = async (method, params, action) => {
    await method(params);
    ElMessage.success(i18n.t(`elmessage.${action}Success`));
    tableRef.value.reload();
  }
  const columnConfirmAction = async (confirmMsg, method, params, action) => {
    await systemConfirm(
      confirmMsg,
      () => columnAction(method, params, action)
    )
  }
  const batchAction = async ({
    method, 
    action, 
    extraParams={}, 
    needConfirm=true, 
    confirmMsg=""
  }) => {
    const ids = tableRef.value.getSelections()?.map(item => item[idKey]);
    if(!ids?.length) {
      ElMessage.warning(i18n.t("valid.checked"));
      return
    }
    const params = {
      ...extraParams,
      ids
    }
    if(needConfirm) {
      await columnConfirmAction(confirmMsg, method, params, action);
    } else {
      await columnAction(method, params, action);
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