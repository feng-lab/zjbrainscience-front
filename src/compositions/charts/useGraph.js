import { GraphChart } from "echarts/charts";
import { computed } from "vue";

export function useGraph(props) {
  const option = computed(() => ({
    series: {
      type: "graph",
      data: props.data,
      ...props?.series
    },
    ...props?.option
  }))

  return {
    components: [ GraphChart ],
    option
  }
}

