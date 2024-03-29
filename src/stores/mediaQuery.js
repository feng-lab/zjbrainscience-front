
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import useGlobalStore from "./global";

const useMediaQuery = defineStore("mediaQuery", () => {
  const breakpoint = ref("");
  const BREAKPOINT_QUERY = {
    "xs": "(max-width: 767px)",
    "sm": "(min-width: 768px) and (max-width: 991px)",
    "md": "(min-width: 992px) and (max-width: 1199px)",
    "lg": "(min-width: 1200px) and (max-width: 1919px)",
    "xl": "(min-width: 1920px)",
  };

  const setBreakpoint = (bp, mql) => {
    if(mql.matches) {
      breakpoint.value = bp;
      const { isCollapse } = storeToRefs(useGlobalStore());
      if(bp === "md") {
        isCollapse.value = true;
      } else {
        isCollapse.value = false;
      }
      console.log('now break point is ', breakpoint.value)
    }
  }
  
  const queryBreakpoint = (bp) => {
    const mql = window.matchMedia(BREAKPOINT_QUERY[bp]);
    setBreakpoint(bp, mql);

    mql.addEventListener("change", (e) => {
      setBreakpoint(bp, e);
    })
  }

  Object.keys(BREAKPOINT_QUERY).forEach(bp => queryBreakpoint(bp));
  
  return {
    breakpoint
  }
});

export default useMediaQuery;