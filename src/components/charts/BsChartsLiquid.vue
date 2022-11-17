<template>
  <v-chart class="chart" :option="option" autoresize/>
</template>

<script setup>
import VChart from "vue-echarts";
import "echarts-liquidfill";

import { computed } from "vue";

const props = defineProps({
  data: {
    type: Number,
    default: 0
  }
})

const option = computed(() => {
  return {
    series: [{
      type: 'liquidFill',
      //color: ["#bae7ff", "#69c0ff", "#1890ff"],
      //color: ["#5b8ff9"],
      color: ["#c6cfec", "#9fafdf", "#5470c6"],
      data: new Array(3).fill(props.data),
      label: {
        fontSize: 38,
        formatter: function(param) {
          return (param.value * 100).toFixed(2) + "%"
        }
      },
      amplitude: '2%',
      backgroundStyle: {
        color: "white"
      },
      radius: "80%",
      outline: {
        itemStyle: {
          //borderColor: "#1890ff",
          //borderColor: "#5b8ff9",
          borderColor: "#5470c6",
          borderWidth: 4
        }
      },
      itemStyle: {
        shadowBlur: 0
      }
    }]
  }
})
</script>
<style scoped lang="scss">
.chart {
  height: 100%;
}
</style>
