<template>
  <bs-charts-line
    :option="option" 
    :style="{height: `${chartHeight}px`}"
    ref="chartRef"
  />
</template>

<script setup> 
import BsChartsLine from '@/components/charts/BsChartsLine.vue';

import { onMounted, ref, watch } from "vue";
const props = defineProps({
  eegData: {
    type: Object,
    required: true,
    default: {
      Stimulation: [],
      datasets: [],
      x_data: []
    }
  },
  toolBox: {
    type: Boolean,
    default: true
  },
  zoom: {
    type: Boolean,
    default: true
  },
  chartHeight: {
    type: Number,
    required: true
  }
});

const option = ref();
/*
const style= ref({
  height: `${props.eegData.datasets.length * 110}px`,
})
*/

const chartRef = ref();
const gridHeight = ref(100);

watch(
  () => props.eegData,
  () => {
    getOption();
  }
)

onMounted(()=> {
  getOption();
})

const setGridHeight = () => {
  const { chartHeight, eegData } = props;
  if(eegData.datasets.length) {
    gridHeight.value = parseInt((chartHeight - 40)/eegData.datasets.length);
  }
}

const getOption = () => {
  const { stimulation, datasets, x_data } = props.eegData; 
  const xAxis = [];
  const yAxis = [];
  const grid = [];
  const series = [];
  const xAxisIndexs = [];
  const title = [];
  option.value = {
  }
  setGridHeight();
  datasets.forEach((data, index) => {
    xAxisIndexs.push(index);
    title.push({
      show: true,
      text: data.name,
      left: 0,
      bottom:  index * gridHeight.value+15,
      textStyle: {
        fontWeight: 'normal',
        fontSize: 11,
        lineHeight: gridHeight.value
      }
    })
    grid.push({
      id: index,
      left: 50,
      bottom: index * gridHeight.value+20,
      right: 20,
      height: gridHeight.value,
    });
    xAxis.push({
      id: index,
      gridId: index,
      show: true,
      type: "category",
      axisLine: {
        onZero: index !== 0
      },
      axisTick: {
        onZero: false,
        show: index === 0,
      },
      axisLabel: {
        show: index === 0
      },
      data: x_data.map(x => x * 1000)
    });
    yAxis.push({
      show: false,
      id: index,
      gridId: index,
      name: data.name,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      },
    });
    series.push({
      name: data.name,
      type: "line",
      xAxisIndex: index,
      yAxisIndex: index,
      data: data.data,
      markLine: {
        silent: true,
        lineStyle: {
          color: "#52c41a",
        },
        label: {
          show: index === (datasets.length -1),
          color: "#52c41a",
          fontWeight: 600
        },
        symbol: ['none', 'none'],
        data: stimulation.map(mark => ({
          xAxis: mark
        }))
      }
    })
  });
  chartRef.value.clearChart();
  option.value = {
    toolbox: {
      show: props.toolBox
    },
    legend: {
      show: false
    },
    tooltip: {
      trigger: "axis",
      padding: [10, 20, 10, 20],
      backgroundColor: 'rgba(0,0,0,0.7)',
      textStyle: {
        color: "#fff",
      },
      position: function (pos, params, el, elRect, size) {
        var obj = { top: 10 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      formatter: (params) => {
        const width = Math.max(parseInt(params.length / 15 * 120), 120);
        const header = `<div style="font-weight: 900;font-size: 16px; margin-bottom: 8px">${params[0].axisValue}</div>`;
        let body = "";
        params.forEach(param => {
          const s = param.marker + 
              `<span style="font-weight: 400;margin-left: 2px"> ${param.seriesName}:</span>` + 
              `<span style="float: right;margin-left: 16px;font-weight: 900"> ${param.value.toFixed(2)} ${datasets[param.seriesIndex].unit}</span>` 
          body += `<div style="zoom: .8;margin-right: 14px">${s}</div>`
        })
        return `<div style="width: ${width}px">${header}<div style="display:flex;flex-wrap: wrap">${body}</div></div>`;
      }
    },
    xAxis,
    yAxis,
    grid,
    title,
    axisPointer: {
      link: [{
        xAxisIndex: 'all'
      }]
    },
    dataZoom: [{
       type: 'inside',
          xAxisIndex: xAxisIndexs,
        },
        {
          show: props.zoom,
          xAxisIndex: xAxisIndexs,
          type: 'slider',
          bottom: 0,
          height: 15
    }],
    series
  }
}


</script>