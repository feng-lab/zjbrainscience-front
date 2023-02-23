<template>
  <el-card class="main-content">
    <el-descriptions 
      :title="`${exForm.name} (ID: ${exForm.id})`" 
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
          {{ YES_OR_NO[exForm.is_non_invasive] }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('experiments.detail.is_shared')" align="center">
          {{ YES_OR_NO[exForm.is_shared] }}
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
        {{ $t("button.moreDetails") }}
        <el-icon><arrow-down/></el-icon>
      </el-button>
    </div>
    <el-menu
      :default-active="activeName"
      mode="horizontal"
      router
    >
      <el-menu-item :index="`${routePrefix}paradigm`">{{$t('experiments.tab.paradigm')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}file`">{{$t('term.file')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}subject`">{{$t('subject.text')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}equipment`">{{$t('experiments.tab.equipment')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}assistant`">{{$t('experiments.tab.assistant')}}</el-menu-item>
    </el-menu>
    <div class="m-t-16">
      <router-view/>
    </div>
  </el-card>
  
</template>
<script setup>
import BsRouteLink from "@/components/BsRouteLink.vue";

import { ref, provide, onMounted, computed } from "vue";
import { exDetailApi } from "@/api/experiments";
import { storeToRefs } from "pinia";
import useMediaQuery from "@/stores/mediaQuery";
import { useRoute } from "vue-router";
import { useUtils } from "@/compositions/useUtils";

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

const routePrefix = `/experiments/detail/${props.experiment_id}/`;

const column = {
  "xl": 4,
  "lg": 4,
  "md": 2,
  "sm": 2,
  "xs": 1
}
const { breakpoint } = storeToRefs(useMediaQuery()); 

const showMore = ref(false);
const route = useRoute();

const activeName = computed(() => route.fullPath); 
const { YES_OR_NO } = useUtils();

provide('exid', Number(props.experiment_id));

onMounted(async () => {
  exForm.value = await exDetailApi(props.experiment_id);
})


</script>