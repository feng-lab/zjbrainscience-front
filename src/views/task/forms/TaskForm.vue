<template>
  <TheFormDialog
    :title="$t('button.newTask')"
  >
    <el-form-item :label="`${$t('task.detail.name')}${$t('colon')}`">
      <el-input />
    </el-form-item>
    <el-form-item :label="`${$t('task.detail.desc')}${$t('colon')}`">
      <el-input />
    </el-form-item>
    <el-form-item :label="`${$t('task.detail.dataset')}${$t('colon')}`">
      <el-button type="primary" @click="handleSelect">{{ $t("button.select") }}</el-button>
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
          <TheIconImg icon="Check"/>
        </el-tag>
    </el-form-item>
    <el-form-item :label="`${$t('task.card.step')}${$t('colon')}`">
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
    </el-form-item>
    <el-steps direction="vertical" class="step-form">
      <el-step 
        v-for="(step, index) in stepList"
        :key="step.name"
        status="process"
      >
        <template #title>
          <div class="steps-title">
            <span class="m-r-8 steps-title--text">{{ `Step ${index+1} - ${$t(`task.step.${step.type}`)}` }}</span>
            <el-tooltip placement="right" :content="$t('task.delTip')">
              <el-icon color="#ff4d4f" @click="deleteStep(index)"><Delete /></el-icon>
            </el-tooltip>
          </div>

        </template>
        <template #description>
          <div style="padding: 8px 0">
            <StepWaveFilterForm v-if="step.type === 'filter'"/>
            <StepAnalysisForm v-else/>
          </div>
        </template>
      </el-step>
    </el-steps>
  <TheTargetFile 
    v-model:visible="visible" 
    v-model:selectFile="selectFile"
    :source="source"
  />
  </TheFormDialog>
</template>
<script setup>
import StepWaveFilterForm from './StepWaveFilterForm.vue';
import { ref } from "vue";
import StepAnalysisForm from './StepAnalysisForm.vue';
import Array from "lodash/array";
import TheTargetFile from "@/components/TheTargetFile.vue";
import TheIconImg from "@/components/TheIconImg.vue";

import { useTargetFiles } from "@/compositions/useTargetFiles";
const { source, visible, selectFile, handleSelect } = useTargetFiles();

const stepList = ref([]);

const addWaveFilterStep = () => {
  stepList.value.push({
    type: "filter",
    name: `wavefilter${stepList.value.length}`
  })
}


const addAnalysisStep = () => {
  stepList.value.push({
    type: "analysis",
    name: `analysis${stepList.value.length}`
  })
}

const deleteStep = (index) => {
  Array.remove(stepList.value, (v, i) => i === index);

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