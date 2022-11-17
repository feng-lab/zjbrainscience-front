<template>
  <bs-charts-line
    v-if="step.operationtype === '预处理'" 
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
  <el-image :src="imgSrc" :preview-src-list="[imgSrc]" v-else style="height: 300px" fit="fill"/>
</template>
<script setup>
import BsChartsLine from '@/components/charts/BsChartsLine.vue';

import { onMounted, ref, watch } from "vue"
import { 
  filterResultApi,
  analysisResultApi
 } from '@/api/task';

const props = defineProps({
  step: Object,
  taskid: String
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