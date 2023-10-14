<template>
  <v-chart 
    class="chart" 
    :option="option" 
    autoresize 
    ref="chartRef"
    :style="{width, height}"
  />
</template>

<script>
import VChart from "vue-echarts";

import { useCharts } from "@/compositions/charts/useCharts";

export default {
  props: {
    chartType: {
      type: String,
      default: "bar"
    },
    width: {
      type: String,
      require: true
    },
    height: {
      type: String,
      require: true
    },
    title: String,
    dataset: Object,
    data: Array,
    option: Object,
    series: Object,
    typeSpecificProps: Object
  },
  components: {
    VChart
  },
  setup(props) {
    const { chartRef, option } = useCharts(props);
    console.log('chart option', option.value)
    return {
      chartRef,
      option
    }
  },
  mounted() {
    // expose echarts api
    for(let [key, value] of Object.entries(this?.$refs.chartRef)) {
      if(typeof value === "function") {
        this[key] = value;
      }
    }
  }

}


</script>
<style scoped lang="scss">
.chart {
  height: 100%;
}
</style>