import { ref } from "vue";
import { ElMessage } from "element-plus";
import jsCookie from "js-cookie";
import { useI18n } from "vue-i18n";
import { deleteFileApi } from "@/api/files";
import { useUtils } from "./useUtils";

export function useUpload(experiment_id, is_original=false) {
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
    const res = await systemConfirm(
      i18n.t("file.deleteConfirm", { name }),
      async () => {
        try{
          await deleteFileApi(id);
          ElMessage.success(i18n.t("elmessage.deleteSuccess"));
        } catch(e) {
          return "abort";
        }
      },
      (error) => {
        return "abort";
      }
    );
    if(res === "abort") {
      return false
    }
  }

  const handleSuccess = (response, uploadFile) => {
    console.log('xx')
    uploadFile.id = response.data;
  }

  const options = {
    action: "/api/uploadFile",
    "with-credentials": true, 
    "on-error": handleUploadError,
    "data":{
      experiment_id,
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