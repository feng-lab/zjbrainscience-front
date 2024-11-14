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
      :id="`data-graph${id}`"
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
      default: () => [
        {
          name: '男',
          value: '72',
        },
        {
          name: '女',
          value: '9',
        },
      ],
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
      legend: {
        top: '80%',
        left: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8,
        itemStyle: {
          borderRadius: 5,
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            fontSize: 12,
            // position: 'center',
            // formatter: (params) => {
            //   let str = ''
            //   switch (params.name) {
            //     case '基因组':
            //       str = '{gene|}'
            //       // str = '{gene|}{name|'+ params.name + '}'
            //       break
            //     case '转录组':
            //       str = '{trans|}'
            //       break
            //     case '蛋白质':
            //       str = '{meta|}'
            //       break
            //     default:
            //       str = ''
            //   }
            //   return str
            // },
            // rich: {
            //   gene: {
            //     fontSize: 80,
            //     backgroundColor: {
            //       image: iconObj.gene,
            //     },
            //     align: 'left',
            //     // left: 30,
            //   },
            //   trans: {
            //     fontSize: 80,
            //     // padding: [0, 0, 0, 20],
            //     backgroundColor: {
            //       image: iconObj.trans,
            //     },
            //     align: 'left',
            //   },
            //   meta: {
            //     fontSize: 80,
            //     backgroundColor: {
            //       image: iconObj.meta,
            //     },
            //     align: 'left',
            //   },
            // },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
            lineStyle: {},
            length: 6,
            length2: 6,
          },
          data: [],
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
      dataGraphOption.series[0].data = props.graphData.map((one, index) => ({
        name:
          one.name && one.name.length > 7
            ? one.name.slice(0, 7) + '...'
            : one.name,
        value: one.value,
        itemStyle: { color: itemColorList[index] },
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
  width: 33%;
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
