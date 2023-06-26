<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<script setup>
import VChart from "vue-echarts";
import { SunburstChart } from "echarts/charts";
import { useCharts } from "@/compositions/useCharts";
import { computed } from "vue";

const props = defineProps({
  title: String,
  data: Array,
  option: Object,
  series: Object
})

const { initOption } = useCharts(props.title, [SunburstChart]);

const option = computed(() => ({
  ...initOption.value,
  label: {
    rotate: "tangential"
  },
  series: {
    type: "sunburst",
    data: props.data,
    ...props.series
  },
  ...props.option
}))

</script>