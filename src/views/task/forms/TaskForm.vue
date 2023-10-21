<template>
  <bs-dialog-form
    v-model:form="taskForm"
    :form-model="taskForm"
    :title="$t('button.newTask')"
    :form-submit-api="handleSubmit"
    :form-reset-api="handleReset"
    :form-rules="rules"
    :form-valid-api="validator"
    @open="loadSource"
  >
    <el-form-item :label="$t('task.detail.name')" prop="name">
      <el-input v-model="taskForm.name"/>
    </el-form-item>
    <el-form-item :label="$t('task.detail.desc')" prop="description">
      <el-input v-model="taskForm.description"/>
    </el-form-item>
    <el-form-item :label="$t('task.detail.dataset')" required>
      <el-button type="primary" @click="visible=true">{{ $t("button.select") }}</el-button>
      <span class="el-form-item__error" v-if="validating && !selectFiles.length">
        {{ $t("valid.checked") }}
      </span>
    </el-form-item>
    <el-form-item v-if="selectFiles.length" :label="$t('label.selected') ">
        <el-tag 
          class="m-r-4"
          v-for="file in selectFiles" 
          :key="file.fileid"
        > 
          <span class="between-flex">
            <span class="m-r-8">
              {{ `${file.filename}.${file.filetype}` }}
            </span>
            <bs-icon-img icon="Check"/>
          </span>
        </el-tag>
    </el-form-item>
    <el-form-item :label="$t('task.card.step')" required>
      <el-button type="primary" @click="addWaveFilterStep">
        <template #icon>
          <img src="@/assets/img/analysis/waveFilter-icon.svg" class="btn-img"/>
        </template>
        <span class="m-l-16">{{ $t("button.newFilter") }}</span>
      </el-button>
      <el-button type="primary" @click="addAnalysisStep"> 
        <template #icon>
          <img src="@/assets/img/analysis/analysis-icon.svg" class="btn-analysis-img"/>
        </template>
        <span class="m-l-8">{{ $t("button.newAnalysis") }}</span>
      </el-button>
      <span class="el-form-item__error" v-if="validating && !stepList.length">
        {{ $t("valid.taskstep") }}
      </span>
    </el-form-item>
    <el-steps direction="vertical" class="step-form">
      <el-step 
        v-for="(step, index) in stepList"
        :key="step.name"
        status="process"
      >
        <template #title>
          <div class="steps-title">
            <span class="m-r-8 steps-title--text">
              {{ `Step ${index+1} - ${$t(`task.step.${step.type}`)}` }}
            </span>
            <el-tooltip placement="right" :content="$t('task.delTip')">
              <el-icon color="#ff4d4f" @click="deleteStep(index)"><Delete /></el-icon>
            </el-tooltip>
          </div>
        </template>

        <template #description>
          <div style="padding: 8px 0">
            <StepWaveFilterForm v-if="step.type === 'filter'" :params="step"/>
            <StepAnalysisForm v-else :params="step" :validating="validating"/>
          </div>
        </template>
      </el-step>
    </el-steps>
  <bs-target-file
    ref="targetFileRef"
    v-model="visible" 
    v-model:selectFiles="selectFiles"
    :source="source"
    multiple
  />
  </bs-dialog-form>
</template>
<script setup>

import StepWaveFilterForm from './StepWaveFilterForm.vue';
import StepAnalysisForm from './StepAnalysisForm.vue';
import Array from "lodash/array";
import BsTargetFile from "@/components/BsTargetFile.vue";
import BsIconImg from "@/components/BsIconImg.vue";

import { computed, ref } from "vue";
import { newTaskApi } from "@/api/task";
import { useTargetFiles } from "@/compositions/useTargetFiles";
import { useI18n } from "vue-i18n";
import useTask from '@/stores/task';

const { source, visible, selectFiles, loadSource } = useTargetFiles();

const stepList = ref([]);
const targetFileRef = ref();

const validating = ref(false);
const i18n = useI18n();

const { newTask, addTask } = useTask();

const emit = defineEmits("reloadTask");

const rules = computed(() => ({
  name: [
    { required: true, message: i18n.t("valid.require", { field: i18n.t("task.detail.name"), action: i18n.t("action.input")}), trigger: "blur" }
  ],
  description: [
    { required: true, message: i18n.t("valid.require", { field: i18n.t("task.detail.desc"), action: i18n.t("action.input")}), trigger: "blur" }
  ]
}))

const addWaveFilterStep = () => {
  if(!taskForm.value.tasktype instanceof Set) {
    taskForm.value.tasktype = new Set();
  }
  taskForm.value.tasktype.add("Filter")
  stepList.value.push({
    type: "filter",
    name: `wavefilter${stepList.value.length}`,
    form: ref({
      L_freq: 0,
      H_freq: 1024, 
      CH_picks: "auto",
      Methods: "IIR", 
      Params: "auto", 
      Length: "auto", 
      Window: "hanmming", 
      Design: "firwin", 
      Phase: "zero", 
      I_trans_bandwidth:"auto",
      I_trans_bnaswidth:"auto"
    }),
    formRef: ref()
  })
}

const taskForm = ref({
  name: "",
  description: "",
  tasktype: new Set() 
})

const addAnalysisStep = () => {
  if(!taskForm.value.tasktype instanceof Set) {
    taskForm.value.tasktype = new Set();
  }
  taskForm.value.tasktype.add("Analysis")
  stepList.value.push({
    type: "analysis",
    name: `analysis${stepList.value.length}`,
    form: ref({
      methods: [],
      topomap: {
        totalImages: 10,
        interval: 2
      }
    }),
    warning: ref(false)
  })
}

const deleteStep = (index) => {
  Array.remove(stepList.value, (v, i) => i === index);

}

const handleSubmit = async () => {
    const postParams = taskForm.value;
    postParams['checkedfile'] = selectFiles.value.map(({filename, filetype, id, size}) => ({
      filename,
      filetype,
      fileid: id,
      size
    }))
    postParams['taskSteps'] = stepList.value.map(({ type, form}) => {
      return type === 'filter' ? {
        type, ...form
      } : {
        type, 
        'analysis-list': form
      }
    });
    //return newTaskApi(postParams).then(() => {
    //  emit("reloadTask");
    //});
    return addTask(postParams).then(() => {
      emit("reloadTask");
    })
}

const validator = async () => {
  validating.value = true;
  // 检查目标文件
  if(!selectFiles.value.length) Promise.reject("No Checked File");
  if(!stepList.value.length) Promise.reject("No Task Step");
  for(let i=0; i < stepList.value.length; i++) {
    const step = stepList.value[i];
    if(step.type === 'analysis' && !step.form.methods.length) {
      Promise.reject("analysis step");
      break;
    } 
    if(step.type === 'filter') {
      await step.formRef.validate();
    }
  }
  return true;
};

const handleReset = () => {
  selectFiles.value = [];
  stepList.value = [];
  targetFileRef.value.clearSelect();
  validating.value = false;
  taskForm.value.tasktype = new Set();
}



</script>

<style lang="scss" scoped>
.btn-img {
  height: 300%;
}

.btn-analysis-img {
  height: 18px;
}

:deep(.el-button i) {
  margin-left: 14px;
}

.steps-title {
  display: inline-flex;
  align-items: center;
  &--text {
    font-weight: bold;
  }
  i {
    cursor: pointer;
  }
}
.step-form {
  margin-left: 40px;
  :deep(.el-step__description) {
    padding-right: 0px;
  }
}
</style>