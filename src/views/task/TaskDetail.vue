<template>
  <el-card class="m-b-16">
    <template #header>
      <div class="between-flex">
        <span>{{ taskinfo.taskname }}</span>

      <TheRouteLink path="/task" type="danger">
        <el-icon><CaretLeft /></el-icon>
        {{ $t("button.back") }}
      </TheRouteLink>
      </div>
    </template>
    <el-descriptions 
      border
      :column="2"
    >
      <el-descriptions-item :label="$t('task.detail.id')" label-align="center">
        {{ taskinfo.taskid }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('task.detail.type')" label-align="center">
        {{ taskinfo.tasktype }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('task.detail.dataset')" label-align="center">
        {{ taskinfo.filename }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('task.detail.dataSize')" label-align="center">
        {{ taskinfo.size }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.startTime')" label-align="center">
        {{ taskinfo.starttime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.endTime')" label-align="center">
        {{ taskinfo.endtime }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('task.detail.desc')" label-align="center">
        {{ taskinfo.description }}
      </el-descriptions-item>

    </el-descriptions>
  </el-card>
  <el-card :header="$t('task.card.step')" class="m-b-16">
    <el-steps style="padding: 0 70px">
      <el-step 
        v-for="step in taskSteps" 
        :key="step.taskid"
        @click="handleClickStep(step)"
        :class="['task-step', {'diplay': step.operationid === displayStep.operationid }]"
        :description="step.operationname"
        :status="stepInfo[step.status].status"
      >
        <template #title> 
          <div class="task-step--title">
          {{`Step ${step.executeindex}: ${step.operationtype}`}}
          </div>
        </template>
        <template #icon> 
          <TheIconImg
            :icon="stepInfo[step.status].icon"
            :iconColor="stepInfo[step.status].color"
            :size="24"
            :loading="step.status === '2'"
          />
        </template>
      </el-step>
    </el-steps>
  </el-card>
  <el-card>
    <template #header>
      <div class="between-flex">
        <span>{{ $t("task.card.result") }} 
          <span v-if="displayStep && displayStep.status === 1">{{ ` - Step ${displayStep.executeindex} ${displayStep.operationname} `}}</span>
        </span>
        <el-button type="primary" link>{{ $t("button.download") }}</el-button>
      </div>
    </template>
    <div v-if="displayStep && displayStep.status === '1'">
      <ChartsLine 
        style="height: 300px"
        v-if="displayStep.operationtype === '预处理'" 
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
    </div>
    <div v-else> 
      <el-result
        icon="warning"
        title="未有执行结果"
        sub-title="当前任务未执行完成或执行错误"
      />
    </div>
  </el-card>
</template>

<script setup>
import { 
  taskDetailApi,
  filterResultApi,
  analysisResultApi
 } from '@/api/task';
import { Loading } from '@element-plus/icons-vue';
import ChartsLine from '@/components/charts/ChartsLine.vue';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  taskid: String
})


const stepInfo = {
  "0": {status: "error", color: "var(--el-color-danger)", icon: "CircleClose"},
  "1": {status: "success", color: "var(--el-color-primary)", icon: "CircleCheck"},
  "2": {status: "process", color: "var(--el-color-blue)", icon: "Loading"}
}

const chartsData = ref();
const imgSrc = ref();


const taskinfo = ref({
  taskid:"", 
  taskname: "",
  tasktype: "",
  status: "0",
  filename: "",
  size: 0,
  starttime: "",
  endtime: "",
  description: ""
})

const taskSteps = ref([]);

const displayStep = ref();

onMounted(() => {
  getTask();
})

const getTask = async () => {
  const { master, stepList } = await taskDetailApi(props.taskid);
  taskinfo.value = master;
  taskSteps.value = stepList;
  displayStep.value = stepList[0];
}

const handleClickStep = (step) => {
  displayStep.value = step;
}

watch(displayStep, async () => {
  const { operationtype, operationid } = displayStep.value;
  console.log(operationtype , displayStep)
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
})


</script>

<style lang="scss" scoped>
.task-step {
  :deep(.el-step__icon.is-icon) {
    width: 24px;
  }
  &--title {
    cursor: pointer;
  }
}

:global(.el-step.is-horizontal.task-step.diplay .el-step__main) {
    zoom: 1.1;
    font-weight: 600;
}
</style>
