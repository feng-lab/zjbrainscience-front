<template>
  <el-card class="main-content">
    <el-descriptions 
      :title="exForm.experimenttitle" 
      :column="3"
      border
      class="m-b-24"
    >
      <template #extra>
        <TheRouteLink path="/experiments" type="danger">
          <el-icon><CaretLeft /></el-icon>
          {{ $t("button.back") }}
        </TheRouteLink>
      </template>
      <el-descriptions-item :label="$t('experiments.detail.exId')" align="center">
        {{ experimentid }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.exType')" align="center">
        {{ exForm.experimentstype }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.startTime')" align="center">
        {{ exForm.startdate }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.subjectType')" align="center">
        {{ exForm.subjectstype }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.subjectCnt')" align="center">
        {{ exForm.numberofsubjects }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.endTime')" align="center">
        {{ exForm.enddate }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.exLocal')" label-align="center">
        {{ exForm.location}}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.exDesc')" label-align="center">
        {{ exForm.description }}
      </el-descriptions-item>
    </el-descriptions>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('experiments.tab.paradigm')" name="paradigm"><DetailParadigm /></el-tab-pane>
      <el-tab-pane :label="$t('term.file')" name="file"><DetailFiles /></el-tab-pane>
      <el-tab-pane :label="$t('subject.text')" name="subject"><DetailSubject /></el-tab-pane>
      <el-tab-pane :label="$t('experiments.tab.device')" name="equipment"><DetailEquipment /></el-tab-pane>
    </el-tabs>
  </el-card>
  
</template>
<script setup>
import { ref, provide, onMounted } from "vue";
import DetailParadigm from "./detail/DetailParadigm.vue";
import DetailFiles from "./detail/DetailFiles.vue";
import DetailSubject from "./detail/DetailSubject.vue";
import DetailEquipment from "./detail/DetailEquipment.vue";
import TheRouteLink from "../../components/TheRouteLink.vue";
import { exByIdApi } from "@/api/experiments";

const props = defineProps({
  experimentid: String
});
const exForm = ref({
  datapath: ""
});

provide('exid', props.experimentid);
provide('filePath', exForm.value.datapath);

const activeName = ref("paradigm");

onMounted(async () => {
  exForm.value = await exByIdApi(props.experimentid);
})


</script>