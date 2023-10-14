<template>
  <el-card class="m-b-16">
    <template #header>
      <div class="between-flex">
        <span>{{ taskinfo.taskname }}</span>
      <bs-route-link path="/task" type="danger">
        <el-icon><caret-left/></el-icon>
        {{ $t("button.back") }}
      </bs-route-link>
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
        <el-tag 
          class="m-r-8"
          effect="dark"
          v-for="file in taskinfo.filename"
          :key="file">
          {{ file }}
        </el-tag>
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
        :status="STEP_INFO[step.status].status"
      >
        <template #title> 
          <div class="task-step--title">
          {{`Step ${step.executeindex}: ${step.operationtype}`}}
          </div>
        </template>
        <template #icon> 
          <bs-icon-img
            :icon="STEP_INFO[step.status].icon"
            :iconColor="STEP_INFO[step.status].color"
            :size="24"
            :loading="step.status === '2'"
          />
        </template>
      </el-step>
    </el-steps>
  </el-card>
  <el-card class="task-result">
    <template #header>
      <div class="between-flex">
        <span>{{ $t("task.card.result") }} 
          <span v-if="displayStep && displayStep.status === 1">{{ ` - Step ${displayStep.executeindex} ${displayStep.operationname} `}}</span>
        </span>
        <el-button type="primary" link v-if="displayStep?.operationtype === '数据分析'">{{ $t("button.download") }}</el-button>
      </div>
    </template>
    <template v-if="displayStep">
      <task-result-error v-if="displayStep.status === '0'"/>
      <task-result-success v-if="displayStep.status === '1'" :step="displayStep" :taskid="taskid"/>
      <task-result-process v-if="displayStep.status === '2'"/>
    </template>
    <template v-else> 
      <el-empty/>
    </template>
  </el-card>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue';
import TaskResultSuccess from './results/TaskResultSuccess.vue';
import TaskResultProcess from './results/TaskResultProcess.vue';
import TaskResultError from './results/TaskResultError.vue';
import BsRouteLink from "@/components/BsRouteLink.vue";
import { STEP_INFO } from '@/utils/common';

import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate } from "vue-router";
import { 
  taskDetailApi,
 } from '@/api/task';

const props = defineProps({
  taskid: String
})



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



onBeforeRouteUpdate((to, from) => {
  if (to.params.taskid !== from.params.taskid) {
    getTask(to.params.taskid);
  }
})
const taskSteps = ref([]);

const displayStep = ref();

onMounted(() => {
  getTask();
})

const getTask = async (id) => {
  console.log(props.taskid)
  const { master, stepList } = await taskDetailApi(id ?? props.taskid);
  taskinfo.value = master;
  taskSteps.value = stepList;
  displayStep.value = stepList[0];
}

const handleClickStep = (step) => {
  displayStep.value = step;
}


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

.task-result {
  .el-result {
    padding: 12px;
    :deep(.el-result__title) {
      margin-top: 0;
    }
  }
}

:global(.el-step.is-horizontal.task-step.diplay .el-step__main) {
    zoom: 1.1;
    font-weight: 600;
}
</style>
