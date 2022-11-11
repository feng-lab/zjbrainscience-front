import { ElMessageBox } from "element-plus";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export function useUtils() {
  const router = useRouter();
  const i18n = useI18n();

  function backToHome() {
    router.push("/");
  }

  function systemConfirm(message, callback) {
    //const title = computed(() => i18n.t("term.systemremind"));
    ElMessageBox.confirm(
      message, 
      i18n.t("term.systemremind"),
      {
        confirmButtonText: i18n.t("button.ok"),
        cancelButtonText: i18n.t("button.cancel"),
        showClose: false,
        type: "warning"
      }
    )
    .then(() => {
      callback();
    })
    .catch(() => {
      console.log("取消")
    })


  }

  return {
    backToHome,
    systemConfirm
  }
}