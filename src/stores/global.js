import i18n from "@/locals";
import { defineStore } from "pinia";
import { computed } from "vue";
import { ref } from "vue";


const useGlobalStore = defineStore("global", () => {
  const isCollapse = ref(false);
  const showDrawer = ref(false);
  const locale = ref(localStorage.getItem('lang') ?? 'zhCn');
  const asideWidth = computed(() => {
    return isCollapse.value ? '64px' : '240px';
  })
  function toggleCollapse() {
    isCollapse.value = !isCollapse.value;
  }
  function toggleDrawer() {
    showDrawer.value = !showDrawer.value;
  }
  function setLocale(localStr) {
    locale.value = localStr;
    localStorage.setItem("lang", localStr);
    i18n.global.locale.value = localStr;
  }
  return {
    isCollapse,
    showDrawer,
    asideWidth,
    locale,
    setLocale,
    toggleCollapse,
    toggleDrawer
  }
})

export default useGlobalStore;