<template>
  <div class="data-overview-container" id="overview">
    <div class="bg"></div>
    <div class="base-info">
      <div class="text-wrap">
        <div class="info">doctor6</div>
        <div class="desc">来源医院：浙江大学医学院附属第一医院</div>
      </div>
      <div class="text-wrap right">
        <div class="info total">13,258</div>
        <div class="desc">总队列人数</div>
      </div>
    </div>
    <div class="line-wrap">
      <PieChart id="1" title="患者性别" :graphData="graphData1" />
      <BarChart id="1" title="年龄分布" :graphData="graphData3" />
      <PieChart id="2" title="诊断类型" :graphData="graphData2" />
    </div>
    <div class="line-wrap">
      <MapChart title="患者来源统计" />
      <BarChart
        id="1"
        title="患者来源医院"
        :graphData="graphData4"
        width="calc(50% - 12px)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, nextTick, watch, ref } from 'vue'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'
import MapChart from './MapChart.vue'
import { useRouter } from 'vue-router'
import { allExByPageApi } from '@/api/datasetManagement'

const graphData1 = [
  {
    name: '男',
    value: '72',
  },
  {
    name: '女',
    value: '9',
  },
]

const graphData2 = [
  {
    name: 'deno AML',
    value: '272',
  },
  {
    name: 'sAML',
    value: '9',
  },
  {
    name: 'Ph+ALL',
    value: '472',
  },
  {
    name: 'Ph-B-ALL',
    value: '39',
  },
  {
    name: 'T-ALL',
    value: '172',
  },
  {
    name: 'ETP-ALL',
    value: '950',
  },
  {
    name: 'Ph+MPAL',
    value: '702',
  },
  {
    name: 'MLL+MPAL',
    value: '89',
  },
  {
    name: 'T-Myeloid MPAL',
    value: '69',
  },
]

const graphData3 = [
  {
    name: '0-10',
    value: '72',
  },
  {
    name: '11-20',
    value: '9',
  },
  {
    name: '21-30',
    value: '42',
  },
  {
    name: '31-40',
    value: '39',
  },
  {
    name: '41-50',
    value: '95',
  },
  {
    name: '51-60',
    value: '372',
  },
  {
    name: '>60',
    value: '722',
  },
]

const graphData4 = [
  {
    name: '浙一医院',
    value: '72',
  },
  {
    name: '浙二医院',
    value: '9',
  },
  {
    name: '邵逸夫医院',
    value: '412',
  },
  {
    name: '浙江省中医院',
    value: '139',
  },
  {
    name: '杭州市第一人民医院',
    value: '172',
  },
  {
    name: '杭州市第三人民医院',
    value: '95',
  },
  {
    name: '杭州市中医院',
    value: '502',
  },
]

onMounted(() => {})
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  top: -40px;
  left: -12px;
  // right: -10px;
  z-index: 0;
  width: calc(100% + 20px);
  height: 360px;
  background-image: url('../../assets/img/queue/overview_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.base-info {
  background: linear-gradient(93deg, #ffffff 57%, rgba(255, 255, 255, 0.2) 99%);
  border-radius: 12px;
  padding: 10px 16px 24px;
  display: flex;
  margin: 16px 0;
  .text-wrap {
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info {
      font-size: 20px;
      font-weight: 600;
      color: #333333;
      &.total {
        font-size: 36px;
        font-weight: 800;
        color: #2e2e30;
      }
    }
    .desc {
      font-size: 14px;
      line-height: 20px;
      color: #666666;
    }
    &.right {
      border-left: solid 2px #ddd;
      padding: 0 12px;
      margin-left: 12px;
    }
  }
}
.line-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
  margin-bottom: 16px;
}
</style>
