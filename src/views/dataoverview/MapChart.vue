<template>
  <el-card class="map-chart-container" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="title">{{ title || '--' }}</span>
        <div class="button">
          <slot name="btn"></slot>
        </div>
      </div>
    </template>
    <div class="map-chart" id="mapChart"></div>
  </el-card>
</template>

<script setup>
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import * as echarts from 'echarts'

defineProps({
  title: String,
})

const mapOption = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/>{c} (p / km2)',
  },
  // visualMap: {
  //   min: 800,
  //   max: 50000,
  //   text: ['High', 'Low'],
  //   realtime: false,
  //   calculable: true,
  //   inRange: {
  //     color: ['lightskyblue', 'yellow', 'orangered'],
  //   },
  // },
  geo: {
    map: 'china',
    roam: true, // 不开启缩放和平移
    zoom: 2, // 视角缩放比例
    label: {
      normal: {
        show: true,
        fontSize: '10',
        color: '#000000' /* 'rgba(0,0,0,0.7)'*/,
      },
    },
    itemStyle: {
      normal: {
        areaColor: 'rgba(73, 178, 78, 0.5)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      emphasis: {
        areaColor: 'rgba(73, 178, 78, 1)', // 鼠标选择区域颜色
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 20,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    // projection: {
    //   project: (point) => point,
    //   unproject: (point) => point,
    // },
    // selectedMode: true,
    // regions: selectRegion.map(region => ({
    //   ...region,
    //   itemStyle: { areaColor: '#F3B329', color: '#000' },
    // })),
    // nameMap: {},
  },
  series: [
    {
      name: '',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      label: {
        show: true,
      },
      data: [],
    },
  ],
})

const mapChart = ref(null)

const getMapData = async () => {
  const res = await import(`../../assets/map/china.json`)
  // const url = `../../../src/assets/map/china.json`
  return res.default
}

const mapChartInit = (mapJson) => {
  if (!mapJson) return
  const chartDom = document.getElementById('mapChart')
  echarts.registerMap('china', { geoJSON: mapJson })
  mapChart.value = echarts.init(chartDom)
  mapOption.geo.center = mapJson.features[26].properties.center
  mapOption.series[0].data = mapJson.features.map((one) => ({
    name: one.properties.name,
    value: 0,
    // value: Math.round(Math.random() * 100),
  }))
  mapChart.value.setOption(mapOption)
  window.addEventListener('resize', () => {
    mapChart.value.resize()
  })
}

onMounted(async () => {
  const data = await getMapData()
  mapChartInit(data)
})
</script>

<style lang="scss" scoped>
.map-chart-container {
  width: calc(50% - 12px);
  height: auto;
  border: none;
  border-radius: 12px;
  :deep(.el-card__header) {
    border-bottom: none;
  }
  .map-chart {
    width: 100%;
    height: 400px;
  }
  .card-header {
    display: inline-block;
    width: calc(100% - 16px);
    .title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #323233;
    }
    .button {
      float: right;
    }
  }
}
</style>
