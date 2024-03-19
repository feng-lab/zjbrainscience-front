<template>
  <bs-charts-line
    v-if="step.operationtype === 'Filter'" 
    style="height: 300px"
    :data="chartsData"
    :option="{
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          formatter: '{yyyy}-{MM}-{dd}'
        }
      },
      yAxis: {
        type: 'value',
      },
    }"
  />
  <div class="image-list-outer" v-else> 
    <div class="image-list" v-for="id in idList" :key="id">  
      <el-image fit="fill" :src="`http://10.11.140.35:2000/results/image${id}.png`"/> 
      <span>{{ `Image ${id}`}} </span>
    </div>
  </div>
</template>
<script setup>
import BsChartsLine from '@/components/charts/BsChartsLine.vue';

import { onMounted, ref, watch, computed } from "vue"
import { 
  filterResultApi,
  analysisResultApi
 } from '@/api/task';

const props = defineProps({
  step: Object,
  taskid: String
})


const idList = computed(() => {
  if(props.step.operationtype === "Filter") {
    return [];
  } 
  const temp = [];
  const { totalImages } = props.step.parameters['analysis-list'].topomap;
  for(let i = 0; i< totalImages; i++) {
    temp.push(i+1);
  }
  return temp;
})

const chartsData = ref();

const imgSrc = ref();

onMounted(() => {
  getResult()
});


const getResult = async () => {
  const { operationtype, operationid } = props.step;
  if(operationtype === "预处理") {
    chartsData.value = await filterResultApi({
      taskid: props.taskid,
      operationid
    })
  } else {
    imgSrc.value = await analysisResultApi({
      taskid: props.taskid,
      operationid
    })
  }

}

watch(() => props.step, getResult);


</script>
<style lang="scss" scoped>
.image-list-outer {
  display: flex;
  flex-wrap: wrap;
}
.image-list {
  width: 300px;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  span {
    margin-top: -10px;
    display: inline-block;
    text-align: center;
  }
}
</style>