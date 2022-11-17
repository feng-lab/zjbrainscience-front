<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<script setup>
import { BarChart } from "echarts/charts";
import VChart from "vue-echarts";
import {
  GridComponent,
} from "echarts/components";

import { computed } from "vue";
import { useCharts } from "@/compositions/useCharts";

const props = defineProps({
  title: String,
  dataset: Object,
  stack: String,
  option: Object,
  series: Object,
});

const { initOption } = useCharts(props.title, [BarChart, GridComponent]);


const option = computed(() => {
  const dimensionsLen = props?.dataset?.dimensions.length;
  return {
    ...initOption.value,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: { type: 'category' },
    yAxis: {},
    dataset: props.dataset,
    series: dimensionsLen ? new Array(dimensionsLen-1).fill({
        type: "bar",
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        stack: props.stack,
        ...props.series
      }) : [],
    ...props.option
  }
})

</script>
<style scoped lang="scss">
.chart {
  height: 100%;
}
</style>