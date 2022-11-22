import { ref, onMounted } from "vue";
import moment from "moment";


export function useShortcuts() {
  const start = ref();
  const end = ref();

  const getDateBefore = (before) => {
    let e = new Date();
    let s = new Date();
    s.setTime(e.getTime() - before);
    start.value = moment(s).format("YYYY-MM-DD"); 
    end.value = moment(e).format("YYYY-MM-DD");
  }

  const getDate = {
    week: () => getDateBefore(3600 * 1000 * 24 * 7),
    month: () => getDateBefore(3600 * 1000 * 24 * 30),
    halfofyear: () => getDateBefore(3600 * 1000 * 24 * 180),
    year: () => getDateBefore(3600 * 1000 * 24 * 365)
  };

  onMounted(() => {
    getDate["week"]();
  })

  return {
    start,
    end,
    getDate
  }
}