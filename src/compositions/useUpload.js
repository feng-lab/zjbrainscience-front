import { ref } from "vue";
import { ElMessage } from "element-plus";
import jsCookie from "js-cookie";
import { useI18n } from "vue-i18n";
import { deleteFileApi } from "@/api/files";
import { useUtils } from "./useUtils";

export function useUpload(experiment_id, path, is_original=false) {
  const access_token = jsCookie.get("access_token");
  const token_type = jsCookie.get("token_type");
  const i18n = useI18n();
  const { systemConfirm } = useUtils();
  const files = ref([]);
  const handleUploadError = (error, uploadFile) => {
    ElMessage.error(`${uploadFile.name} ${i18n.t("elmessage.uploadFail")}`)
  }
  const handleRemove = async (uploadFile) => {
    const { id, name } = uploadFile;
    await systemConfirm(
      i18n.t("file.deleteConfirm", { name }),
      async () => {
        await deleteFileApi(id);
        canDelete = true;
        console.log('now delete', canDelete);
        ElMessage.success(i18n.t("elmessage.deleteSuccess"));
      },
      (error) => {
        return false;
      }
    );
  }

  const handleSuccess = (response, uploadFile) => {
    uploadFile.id = response.data;
  }

  const options = {
    action: "/api/uploadFile",
    "with-credentials": true, 
    "on-error": handleUploadError,
    "data":{
      experiment_id,
      path,
      is_original
    },
    headers: {
      Authorization: `${token_type} ${access_token}`
    },
    'before-remove': handleRemove,
    'on-success': handleSuccess,
    name: "file",
    multiple: true
  }


  return {
    files,
    options
  }

}