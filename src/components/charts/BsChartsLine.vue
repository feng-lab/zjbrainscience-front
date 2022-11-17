<template>
  <v-chart class="chart" :option="option" autoresize ref="chartRef"/>
</template>

<script setup>
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  DataZoomComponent,
} from "echarts/components";
import VChart from "vue-echarts";

import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCharts } from "@/compositions/useCharts";

const props = defineProps({
  title: String,
  dataset: Object,
  data: Array,
  stack: String,
  option: Object,
  series: Object,
  area: Boolean,
});

const chartRef = ref();

const { initOption } = useCharts(
  props.title, 
  [LineChart, GridComponent, DataZoomComponent]
);
const i18n = useI18n();
initOption.value.toolbox.feature['dataZoom'] = {
  title: {
    zoom: i18n.t("label.chartZoom"),
    back: i18n.t("label.chartZoomBack"),
  }
}
let series = {
  type: "line",
  ...props.series
}

if(props.area) {
  series = { 
    ...series, 
    areaStyle: props?.series?.areaStyle ?? {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0, color: '#5470c6' // 0% 处的颜色
        }, {
            offset: 1, color: '#c6cfec' // 100% 处的颜色
        }],
        global: false // 缺省为 false
      }
    }
  }
}

const option = computed(() => {
  const o = {
    ...initOption.value,
    tooltip: {
      trigger: "axis",
    },
    xAxis: {},
    yAxis: {},
    series: series,
    ...props.option
  }
  if(props.dataset) {
    o["dataset"] = props.dataset
  }
  if(props.data) {
    console.log(o.series)
    o.series.data = props.data
  }
  return o;
})

const getHeight = () => {
  return chartRef.value.getHeight();
}

defineExpose({
  getHeight
});


</script>
<style scoped lang="scss">
.chart {
  height: 100%;
}
</style>