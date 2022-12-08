import { ref } from "vue";
import { markToRead } from "@/api/notification";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export function useNotification() {
  const router = useRouter();
  const i18n = useI18n();

  const handleViewNotify = (notify) => {
    const { type, content } = notify;
    if(type === "task_step_status") {
      router.push(`/task/${content.task_id}`);
    }
  } 
  const handleMarkNotify = async (action, notification_ids, showMessage=true) => {
    await markToRead({ 
      is_all: action === "allMask",
      notification_ids 
    });
    if(showMessage) {
      ElMessage.success(i18n.t(`notify.action.${action}`) + i18n.t("status.success"));
    }
  }

  return {
    handleViewNotify,
    handleMarkNotify
  }
}