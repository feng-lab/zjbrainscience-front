import { computed } from "vue";
import { useI18n } from "vue-i18n";
import moment from "moment";


export function useShortcuts() {
  const i18n = useI18n();
  const getDateBefore = (before) => {
    const end = new Date();
    const start = new Date();
    start.setTime(end.getTime() - before);
    return [
      moment(start).format("YYYY-MM-DD"), 
      moment(end).format("YYYY-MM-DD")
    ]
  }
  const shortcuts = computed(() => ([{
    text: i18n.t("datepicker.week"),
    value: () => getDateBefore(3600 * 1000 * 24 * 7)
  }, {
    text: i18n.t("datepicker.month"),
    value: () => getDateBefore(3600 * 1000 * 24 * 30)
  }, {
    text: i18n.t("datepicker.halfofyear"),
    value: () => getDateBefore(3600 * 1000 * 24 * 180)
  }, {
    text: i18n.t("datepicker.year"),
    value: () => getDateBefore(3600 * 1000 * 24 * 365)
  }]));

  return {
    shortcuts
  }
}