<template>
  <ChartsLine 
    :option="option" 
    :style="style"
    ref="chartRef"
  />

</template>

<script setup> 
import ChartsLine from '@/components/charts/ChartsLine.vue';
import { onMounted, ref, watch } from "vue";
const props = defineProps({
  eegData: {
    type: Object,
    default: {
      Stimulation: [],
      datasets: []
    }
  }
});
const option = ref();
const style= ref({
  height: `${props.eegData.datasets.length * 110}px`,
})

const chartRef = ref();

watch(
  () => props.eegData,
  () => {
    style.value = {
      height: `${props.eegData.datasets.length * 110}px`,
    }
    getOption();

  }
)

onMounted(()=> {
  getOption();
})

const getOption = () => {
  const { Stimulation, datasets } = props.eegData; 
  console.log('Stimulation', Stimulation)
  console.log('datasets', )
  const xAxis = [];
  const yAxis = [];
  const grid = [];
  const series = [];
  const xAxisIndexs = [];
  console.log('simulate', Stimulation)
  option.value = {

  }
  datasets.forEach((data, index) => {
    xAxisIndexs.push(index);
    grid.push({
      id: index,
      left: 50,
      bottom: 20 + index * 100,
      right: 20,
      width: "95%",
      height: 100,
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
      //data: xData.map(x => x * 1000)
    });
    yAxis.push({
      id: index,
      gridId: index,
      name: data.name,
      nameLocation: "middle",
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
      nameRotate: 90
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
        data: Stimulation.map(mark => ({
          xAxis: mark
        }))
      }
    })
  });
  option.value = {
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
        let res = `<div style="font-weight: 900;font-size: 18px">${params[0].axisValue}</div>`;
        params.forEach(param => {
          const s = param.marker + 
              `<span style="font-weight: 400;margin-left: 2px"> ${param.seriesName}:</span>` + 
              `<span style="float: right;margin-left: 20px;font-weight: 900"> ${param.value.toFixed(2)} ${datasets[param.seriesIndex].unit}</span>` + 
              "<br/>"
          res += `<div style="margin: 20px 0">${s}</div>`
        })
        return `<div p>${res}</div>`;
      }
    },
    xAxis,
    yAxis,
    grid,
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
          show: true,
          xAxisIndex: xAxisIndexs,
          type: 'slider',
          bottom: 0,
    }],
    series
  }
  console.log(option, option.value)
}

const getHeight = () => {
  console.log('eeddisplay')
  return chartRef.value.getHeight();
}

defineExpose({
  getHeight
});
</script>