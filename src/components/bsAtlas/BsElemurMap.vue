<template>
  <div
    :id="`geo-map-${id}-id`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
  <div
    :id="`geo-map-${id}-DAPI`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
  <div
    :id="`geo-map-${id}-NeuN`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
  <div
    :id="`geo-map-${id}-PV`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
  <div
    :id="`geo-map-${id}-NeuronCellRatio`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
  <div
    :id="`geo-map-${id}-PVNeuronRatio`"
    :class="single ? 'geo-map-single-wrap' : 'geo-map-wrap'"
  ></div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { eeum_region_desc } from '../../locals/eeum_region_desc.js'
import { graphData, graphLinks } from '@/utils/common.js'

const props = defineProps({
  id: {
    type: String,
    default: '2',
  },
  mtype: {
    type: String,
    default: 'id',
  },
  single: {
    type: Boolean,
    default: false,
  },
  color: {
    type: Array,
    default: () => ['#313695', '#ffffbf', '#a50026'],
  },
})

const myChartId = ref(null)
const myChartDAPI = ref(null)
const myChartNeuN = ref(null)
const myChartPV = ref(null)
const myChartNeuronCellRatio = ref(null)
const myChartPVNeuronRatio = ref(null)

const option = reactive({
  title: {
    text: 'atlas',
    // subtext: 'Data from www.census.gov',
    // sublink: 'http://www.census.gov/popest/data/datasets.html',
    left: 'left',
  },
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
  },
  // toolbox: {
  //   show: true,
  //   orient: 'vertical',
  //   left: 'left',
  //   top: 'top',
  //   feature: {
  //     dataView: { readOnly: false },
  //     restore: {},
  //     saveAsImage: {},
  //   },
  // },
  // xAxis: {
  //   show: true,
  //   axisLine: {
  //     show: true,
  //   },
  // },
  // yAxis: {
  //   show: true,
  //   axisLine: {
  //     show: true,
  //   },
  // },
  geo: {
    name: 'eLemur-bg',
    type: 'map',
    projection: {
      project: (point) => point,
      unproject: (point) => point,
    },
    map: null,
    roam: true,
    zoom: 1,
    animationDurationUpdate: 0,
    show: false,
  },
  series: [
    {
      name: 'eLemur',
      type: 'map',
      projection: {
        project: (point) => point,
        unproject: (point) => point,
      },
      map: null,
      // selectedMode: 'single',
      // select: {
      //   itemStyle: {
      //     areaColor: '#ffff00',
      //   },
      // },
      // label: {
      //   show: true,
      // },
      roam: true,
      zoom: 1,
      animationDurationUpdate: 0,
      emphasis: {
        label: {
          show: true,
        },
      },
      data: [],
    },
    {
      type: 'graph',
      zlevel: 0,
      zoom: 1,
      coordinateSystem: 'geo',
      animationDurationUpdate: 0,
      roam: true,
      lineStyle: {
        width: 1,
        curveness: 0,
      },
      data: graphData.map((item, index) => {
        let label = {
          color: '#ccc',
          offset: index >= 30 ? [0, -10] : index === 0 ? [0, -10] : [30, 0],
          show: index % 4 === 1 || index === 0,
        }

        return {
          ...item,
          label: label,
          itemStyle: {
            color: '#b2b2b2',
          },
          tooltip: {
            valueFormatter: () => '',
          },
        }
      }),
      links: graphLinks,
      symbolSize: 3,
      // symbol: 'none',
    },
  ],
})

const getMapData = async (mapCode = '2') => {
  const res = await import(
    `../../locals/geojson/eLemur_geojson_slice${mapCode}.json`
  )
  return res.default
}

const mapChartInit = (mapJson, type, chart) => {
  // console.log('mapJson--->', mapJson)
  if (chart) {
    chart.clear()
  }
  const mid = `geo-map-${props.id}-${type}`
  const mapName = `elemur-${props.id}-${type}`
  option.series[0].map = mapName
  option.geo.map = mapName
  const chartDom = document.getElementById(mid)
  echarts.registerMap(mapName, { geoJSON: mapJson })
  chart = echarts.init(chartDom)
  const seriesData = mapJson.features.map((one) => {
    let id = one.properties.id
    let valueObj = {
      id: id,
      DAPI: eeum_region_desc[id]['DAPI density (# / um^3)'],
      NeuN: eeum_region_desc[id]['NeuN density (# / um^3)'],
      PV: eeum_region_desc[id]['PV density (# / um^3)'],
      NeuronCellRatio:
        eeum_region_desc[id]['NeuN density (# / um^3)'] /
        eeum_region_desc[id]['DAPI density (# / um^3)'],
      PVNeuronRatio:
        eeum_region_desc[id]['PV density (# / um^3)'] /
        eeum_region_desc[id]['NeuN density (# / um^3)'],
    }
    return {
      name: one.properties.name,
      value: valueObj[type],
      itemStyle: {
        backgroundColor: '#fff',
        areaColor: '#' + eeum_region_desc[id].color_hex_triplet,
      },
    }
  })
  option.series[0].data = seriesData
  // option.geo.data = seriesData
  if (type !== 'id') {
    let maxData = 1
    let minData = 0
    let precision = 2
    if (type === 'NeuronCellRatio') {
      option.title.text = 'Neuron/Cell Ratio'
      option.series[0].name = 'Neuron/Cell Ratio'
    } else if (type === 'PVNeuronRatio') {
      option.title.text = 'PV/Neuron Ratio'
      option.series[0].name = 'PV/Neuron Ratio'
      const valueArr = Object.values(eeum_region_desc).map(
        (one) => one['PV density (# / um^3)'] / one['NeuN density (# / um^3)']
      )
      maxData = Math.max(...valueArr)
      minData = 0
    } else {
      const showType = `${type} density (# / um^3)`
      option.title.text = showType
      // const valueArr = seriesData.map((one) => one.value)
      const valueArr = Object.values(eeum_region_desc).map(
        (one) => one[showType]
      )
      maxData = Math.max(...valueArr)
      minData = Math.min(...valueArr)
      option.series[0].name = showType
      precision = 10
    }
    // const showType = `${type} density (# / um^3)`
    // option.title.text = showType
    // // const valueArr = seriesData.map((one) => one.value)
    // const valueArr = Object.values(eeum_region_desc).map((one) => one[showType])
    // const maxData = Math.max(...valueArr)
    // const minData = Math.min(...valueArr)
    // option.series[0].name = 'eLemur - ' + showType
    option.visualMap = {
      left: 'right',
      min: minData,
      max: maxData,
      inRange: {
        color: props.color,
        // color: [
        //   '#313695',
        //   '#4575b4',
        //   '#74add1',
        //   '#abd9e9',
        //   '#e0f3f8',
        //   '#ffffbf',
        //   '#fee090',
        //   '#fdae61',
        //   '#f46d43',
        //   '#d73027',
        //   '#a50026',
        // ],
      },
      precision: precision,
      // handleIcon: "none",
      // text: ['High', 'Low'],
      // textStyle: {
      //   color: '#ffdddd',
      // },
      calculable: true,
    }
  }
  chart.showLoading('default', {
    text: 'loading...',
    color: '#24a36f',
    textColor: '#24a36f',
  })
  chart.setOption(option)
  chart.on('georoam', async (params) => {
    const chartOption = chart.getOption()
    console.log('chartOption--->', chartOption)
    if (params.zoom !== null || params.zoom !== undefined) {
      chartOption.geo[0].zoom = chartOption.series[0].zoom
      chartOption.series[1].zoom = chartOption.series[0].zoom
      chartOption.geo[0].center = chartOption.series[0].center
      chartOption.series[1].center = chartOption.series[0].center
      chartOption.geo[0].animationDurationUpdate = 0
      chartOption.series[0].animationDurationUpdate = 0
      chartOption.series[1].animationDurationUpdate = 0
    } else {
      chartOption.geo[0].center = chartOption.series[0].center
      chartOption.series[1].center = chartOption.series[0].center
    }
    chart.setOption(chartOption)
  })
  setTimeout(() => {
    chart.hideLoading()
  })
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(async () => {
  const mapdata = await getMapData(props.id)
  const typeList = [
    { type: 'id', chart: myChartId.value },
    { type: 'DAPI', chart: myChartDAPI.value },
    { type: 'NeuN', chart: myChartNeuN.value },
    { type: 'PV', chart: myChartPV.value },
    { type: 'NeuronCellRatio', chart: myChartNeuronCellRatio.value },
    { type: 'PVNeuronRatio', chart: myChartPVNeuronRatio.value },
  ]
  typeList.forEach((item) => {
    nextTick(() => {
      mapChartInit(mapdata, item.type, item.chart)
    })
  })
})

onUnmounted(async () => {
  window.removeEventListener('resize', () => {
    myChartId.value.clear()
    myChartDAPI.value.clear()
    myChartNeuN.value.clear()
    myChartDAPI.value.clear()
    myChartNeuronCellRatio.value.clear()
    myChartPVNeuronRatio.value.clear()
  })
  myChartId.value && myChartId.value.dispose()
  myChartDAPI.value && myChartDAPI.value.dispose()
  myChartNeuN.value && myChartNeuN.value.dispose()
  myChartPV.value && myChartPV.value.dispose()
  myChartNeuronCellRatio.value && myChartNeuronCellRatio.value.dispose()
  myChartPVNeuronRatio.value && myChartPVNeuronRatio.value.dispose()
})
</script>

<style scoped lang="scss">
.geo-map-wrap {
  height: 40vh;
  width: 16%;
  // transform: rotate(180deg);
}
.geo-map-single-wrap {
  height: 100vh;
  width: 100%;
  // transform: rotate(180deg);
}
</style>
