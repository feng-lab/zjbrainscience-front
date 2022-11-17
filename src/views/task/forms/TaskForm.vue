<template>
  <bs-form-dialog
    :form-model="taskForm"
    :title="$t('button.newTask')"
    :do-form-submit="handleSubmit"
    :do-form-reset="handleReset"
    :form-rules="rules"
    :validator="validator"
    @open="handleSelect"
    @close="handleClose"
  >
    <el-form-item :label="`${$t('task.detail.name')}${$t('colon')}`" prop="taskname">
      <el-input v-model="taskForm.taskname"/>
    </el-form-item>
    <el-form-item :label="`${$t('task.detail.desc')}${$t('colon')}`" prop="description">
      <el-input v-model="taskForm.description"/>
    </el-form-item>
    <el-form-item :label="`${$t('task.detail.dataset')}${$t('colon')}`" required>
      <el-button type="primary" @click="visible=true">{{ $t("button.select") }}</el-button>
      <span class="el-form-item__error" v-if="validating && !selectFile.length">
        {{ $t("valid.checked") }}
      </span>
    </el-form-item>
    <el-form-item v-if="selectFile.length">
        <span>
          {{ $t("label.selected") }}
          {{ $t("colon") }}
        </span>
        <el-tag 
          class="m-r-4"
          v-for="file in selectFile" 
          :key="file.fileid"
        > 
          {{ `${file.filename}.${file.filetype}` }}
          <bs-icon-img icon="Check"/>
        </el-tag>
    </el-form-item>
    <el-form-item :label="`${$t('task.card.step')}${$t('colon')}`" required>
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
    v-model:visible="visible" 
    v-model:selectFile="selectFile"
    :source="source"
  />
  </bs-form-dialog>
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

const { source, visible, selectFile, handleSelect } = useTargetFiles();

const stepList = ref([]);
const targetFileRef = ref();

const validating = ref(false);
const i18n = useI18n();

const emit = defineEmits("reloadTask");

const rules = computed(() => ({
  taskname: [
    { required: true, message: i18n.t("valid.require", { field: i18n.t("task.detail.name"), action: i18n.t("action.input")}), trigger: "blur" }
  ],
  description: [
    { required: true, message: i18n.t("valid.require", { field: i18n.t("task.detail.desc"), action: i18n.t("action.input")}), trigger: "blur" }
  ]
}))

const addWaveFilterStep = () => {
  stepList.value.push({
    type: "filter",
    name: `wavefilter${stepList.value.length}`,
    form: ref({
      L_freq: 0,
      H_freq: 1024, 
      CH_picks: "",
      Methods: "IIR", 
      Params: "xxx", 
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
  taskname: "",
  description: ""
})

const addAnalysisStep = () => {
  stepList.value.push({
    type: "analysis",
    name: `analysis${stepList.value.length}`,
    form: ref([]),
    warning: ref(false)
  })
}

const deleteStep = (index) => {
  Array.remove(stepList.value, (v, i) => i === index);

}

const handleSubmit = () => {
    const postParams = taskForm.value;
    postParams['checkedfile'] = selectFile.value.map(({filename, filetype, fileid}) => ({
      filename,
      filetype,
      fileid
    }))
    postParams['taskSteps'] = stepList.value.map(({ type, form}) => {
      return type === 'filter' ? {
        type, ...form
      } : {
        type, 
        'analysis-list': form
      }
    });
    return newTaskApi(postParams).then(() => {
      emit("reloadTask");
    });
}

const validator = async () => {
  validating.value = true;
  // 检查目标文件
  if(!selectFile.value.length) Promise.reject("No Checked File");
  if(!stepList.value.length) Promise.reject("No Task Step");
  for(let i=0; i < stepList.value.length; i++) {
    const step = stepList.value[i];
    if(step.type === 'analysis' && !step.form.length) {
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
  selectFile.value = [];
  stepList.value = [];
  targetFileRef.value.clearSelect();
  validating.value = false;
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