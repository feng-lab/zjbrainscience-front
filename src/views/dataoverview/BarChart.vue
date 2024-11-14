<template>
  <el-card class="data-graph-wrap" shadow="never" :style="{ width: width }">
    <template #header>
      <div class="card-header">
        <span class="title">{{ title || '--' }}</span>
        <div class="button">
          <slot name="btn"></slot>
        </div>
      </div>
    </template>
    <!-- <el-scrollbar > -->
    <div
      v-if="true"
      :id="`bar-graph${id}`"
      :ref="dataGraphRef"
      class="graph-content"
    ></div>
    <!-- </el-scrollbar> -->
    <el-empty v-else> </el-empty>
  </el-card>
</template>

<script>
import {
  reactive,
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  computed,
  watchEffect,
  watch,
  defineComponent,
} from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    graphData: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: '1',
    },
    title: String,
    width: {
      type: String,
      default: 'calc(33.3% - 12px)',
    },
  },
  setup(props) {
    const dataGraphRef = (el) => {
      if (el) {
        refItem.value = el
      }
    }
    const refItem = ref(null)
    const itemColorList = [
      '#49B24E',
      '#FEC53D',
      '#FEC53D',
      '#FEE58F',
      '#FFF6C4',
      '#8AC1FB',
      '#1280F7',
      'rgba(73, 178, 78, 0.5)',
      '#1AA391',
    ]
    let bgColor = [
      { offset: 0, color: '#75DA8E' },
      { offset: 1, color: '#2BCD65' },
    ]
    let dataGraphInstance
    // const iconObj = {
    //   gene: new URL('../../../assets/img/gene.png', import.meta.url).href,
    //   trans: new URL('../../../assets/img/trans.png', import.meta.url).href,
    //   meta: new URL('../../../assets/img/meta.png', import.meta.url).href,
    // }
    const dataGraphOption = reactive({
      // title: {
      //   text: props.title || '',
      //   left: 'center',
      //   right: 'center',
      // },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const { name, value } = params.data
          return `${props.graphData[params.dataIndex].name}：${value}`
        },
      },
      xAxis: {
        type: 'category',
        data: [],
        boundaryGap: [0, 0.01],
        splitLine: { show: false },
        axisLine: { show: true },
        axisLabel: {
          formatter: '{value}',
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
        data: [],
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          name: '',
          type: 'bar',
          z: 1,
          data: [],
          barWidth: 26,
          itemStyle: {
            // color: new echarts.graphic.LinearGradient(1, 0, 0, 0, bgColor),
            color: 'rgba(73, 178, 78, 0.5)',
            borderRadius: [20, 20, 20, 20],
            width: '20px',
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(73, 178, 78, 1)',
            },
          },
        },
      ],
    })
    const loadingConfig = {
      text: '加载中...',
      color: '#24a36f',
      textColor: '#24a36f',
    }
    const dataGraph = () => {
      if (dataGraphInstance) {
        dataGraphInstance.clear()
      }
      dataGraphInstance = echarts.init(refItem.value)
      dataGraphInstance.showLoading(loadingConfig)
      console.log('props.graphData', props.graphData)
      if (!props.graphData.length) {
        if (props.loadingError) dataGraphInstance.hideLoading()
        return
      }
      dataGraphOption.xAxis.data = props.graphData.map((one) => one.name)
      dataGraphOption.series[0].data = props.graphData.map((one, index) => ({
        name:
          one.name && one.name.length > 7
            ? one.name.slice(0, 7) + '...'
            : one.name,
        value: one.value,
        // itemStyle: { color: itemColorList[index] },
      }))
      dataGraphInstance.setOption(dataGraphOption)
      window.addEventListener('resize', function () {
        dataGraphInstance.resize()
      })
      setTimeout(() => {
        dataGraphInstance.hideLoading()
      }, 50)
    }

    const drawGraphsInit = () => {
      nextTick(() => {
        dataGraph()
      })
    }

    onMounted(async () => {
      drawGraphsInit()
    })

    // watch(
    //   () => props.graphData,
    //   (newdata, olddata) => {
    //     drawGraphsInit()
    //   }
    // )

    return {
      dataGraphRef,
      dataGraph,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-graph-wrap {
  height: 500px;
  position: relative;
  border: none;
  border-radius: 12px;
  :deep(.el-card__header) {
    border-bottom: none;
  }
  .graph-content {
    height: 400px;
    width: 100%;
  }
  .total-info {
    position: absolute;
    bottom: 54%;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 999;
    height: 32px;
    width: 100px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    line-height: 32px;
    .unit {
      font-size: 14px;
    }
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
