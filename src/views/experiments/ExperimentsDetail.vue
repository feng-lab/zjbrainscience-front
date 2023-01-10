<template>
  <el-card class="main-content">
    <el-descriptions 
      :title="exForm.name" 
      :column="column[breakpoint]"
      border
      class="m-b-24"
    >
      <template #extra>
        <bs-route-link path="/experiments/list" type="danger">
          <el-icon><CaretLeft /></el-icon>
          {{ $t("button.back") }}
        </bs-route-link>
      </template>
      <el-descriptions-item :label="$t('experiments.detail.type')" align="center">
        {{ exForm.type }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('experiments.detail.main_operator')" align="center">
        {{ `${exForm?.main_operator.username}(${exForm?.main_operator.staff_id})`}}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.startTime')" align="center">
        {{ exForm.start_at }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('label.endTime')" align="center">
        {{ exForm.end_at }}
      </el-descriptions-item>
      <template v-if="showMore">
        <el-descriptions-item :label="$t('experiments.detail.subject_type')" align="center">
          {{ exForm.subject_type }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.subject_num')" align="center">
          {{ exForm.subject_num }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.session_num')" align="center">
          {{ exForm.session_num }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.trail_num')" align="center">
          {{ exForm.trail_num }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.neuron_source')" align="center">
          {{ exForm.neuron_source }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.stimulation_type')" align="center">
          {{ exForm.stimulation_type }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.experiment_id')" align="center">
          {{ experiment_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.is_non_invasive')" align="center">
          {{ exForm.is_non_invasive}}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.is_shared')" align="center">
          {{ exForm.is_shared }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.location')" label-align="center">
          {{ exForm.location }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.description')" label-align="center">
          {{ exForm.description }}
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <div style="overflow:hidden">
      <el-button class="right" link size="small" type="primary" v-if="showMore" @click="showMore=false"> 
        {{ $t("button.collapse") }}
        <el-icon><arrow-up/></el-icon>
      </el-button>
      <el-button class="right" link size="small" type="primary" v-else @click="showMore=true"> 
        {{ $t("button.more") }}
        <el-icon><arrow-down/></el-icon>
      </el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('experiments.tab.paradigm')" name="paradigm"><detail-paradigm/></el-tab-pane>
      <el-tab-pane :label="$t('term.file')" name="file" lazy><detail-files/></el-tab-pane>
      <el-tab-pane :label="$t('subject.text')" name="subject" lazy><detail-subject/></el-tab-pane>
      <el-tab-pane :label="$t('experiments.tab.device')" name="equipment" lazy><detail-equipment/></el-tab-pane>
      <el-tab-pane :label="$t('experiments.tab.assistant')" name="assistant" lazy><detail-assistants/></el-tab-pane>
    </el-tabs>
  </el-card>
  
</template>
<script setup>
import BsRouteLink from "@/components/BsRouteLink.vue";

import { ref, provide, onMounted } from "vue";
import { exDetailApi } from "@/api/experiments";
import { storeToRefs } from "pinia";
import useMediaQuery from "@/stores/mediaQuery";
import DetailParadigm from "./detail/DetailParadigm.vue";
import DetailFiles from "./detail/DetailFiles.vue";
import DetailSubject from "./detail/DetailSubject.vue";
import DetailEquipment from "./detail/DetailEquipment.vue";
import DetailAssistants from "./detail/DetailAssistants.vue";

const props = defineProps({
  experiment_id: String
});
const exForm = ref({
  datapath: "",
  main_operator: {
    username: "",
    staff_id: ""
  }
});

const column = {
  "xl": 4,
  "lg": 4,
  "md": 2,
  "sm": 2,
  "xs": 1
}
const { breakpoint } = storeToRefs(useMediaQuery()); 

const showMore = ref(false);

provide('exid', props.experiment_id);

const activeName = ref("paradigm");

onMounted(async () => {
  exForm.value = await exDetailApi(props.experiment_id);
})


</script>