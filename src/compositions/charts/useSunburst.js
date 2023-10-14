import { SunburstChart } from "echarts/charts";
import { computed } from "vue";

export function useSunburst(props) {
  const option = computed(() => ({
    label: {
      rotate: "tangential"
    },
    series: {
      type: "sunburst",
      data: props.data,
      ...props?.series
    },
    ...props?.option
  }))

  return {
    components: [ SunburstChart ],
    option
  }
}