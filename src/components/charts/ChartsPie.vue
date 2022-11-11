<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<script setup>
import { useCharts } from "@/compositions/useCharts";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { ref, computed } from "vue";

const props = defineProps({
  title: String,
  data: Object,
  option: Object,
  series: Object,
});

console.log('props', props);
const { initOption } = useCharts(props.title, [PieChart])

const seriesCenterV = props.title ? "60%" : "50%";


const option = computed(() => ({
  ...initOption.value,
  tooltip: {
    trigger: "item",
    formatter: "{b} : {c} ({d}%)"
  },
  series: [{
    type: "pie",
    radius: "65%",
    center: ["50%", seriesCenterV],
    data: props.data,
    ...props.series
  }],
  ...props.option
}))

console.log('pie option', option)

</script>
<style scoped lang="scss">
.chart {
  height: 100%;
}
</style>