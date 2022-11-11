import { ref } from "vue";
import { ElMessage } from "element-plus";
import jsCookie from "js-cookie";
import { useI18n } from "vue-i18n";

export function useUpload(experimentid) {
  const crsftoken = jsCookie.get("csrftoken");
  const i18n = useI18n();
  const files = ref([]);
  const handleUploadError = (error, uploadFile) => {
    ElMessage.error(`${uploadFile.name} ${i18n.t("button.upload")} ${i18n.t("status.fail")}`),
    console.log('error', error);
  }
  const options = {
    action: "http://127.0.0.1:8000/addfile",
    "with-credentials": true, 
    "on-error": handleUploadError,
    "data":{
      experimentid
    },
    "headers": {
      'X-CSRFToken': crsftoken,
    },
    name: "batch",
    multiple: true
  }


  return {
    files,
    options
  }

}