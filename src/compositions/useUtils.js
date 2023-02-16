import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import useClipboard from 'vue-clipboard3';

export function useUtils() {
  const router = useRouter();
  const i18n = useI18n();

  const GENDER = computed(() => ({
    "male": i18n.t("label.male"),
    "female": i18n.t("label.female") 
  }))

  const YES_OR_NO = computed(() => ({
    [false]: i18n.t("label.no"),
    [true]: i18n.t("label.yes") 
  }))

  const MARITAL_STATUS = computed(() => ({
    "married": i18n.t("label.married"),
    "unmarried": i18n.t("label.unmarried")
  }))

  function backToHome() {
    router.push("/");
  }

  function systemConfirm(message, callback, errorHandle) {
    return ElMessageBox.confirm(
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
      return callback();
    })
    .catch((err) => {
      return errorHandle(err);
    })
  }

  function resetForm(formRef) {
    if(!formRef) return;
    formRef.resetFields();
  }

  async function copyText (text) {
    const { toClipboard } = useClipboard();
    await toClipboard(text);
    ElMessage.success(i18n.t("elmessage.copySuccess"));
  }

  return {
    GENDER,
    YES_OR_NO,
    MARITAL_STATUS,
    backToHome,
    systemConfirm,
    resetForm,
    copyText
  }
}