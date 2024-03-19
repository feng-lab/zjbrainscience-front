<template>
  <el-card class="main-content">
    <el-descriptions 
      :column="column[breakpoint]"
      :title="`${exForm.species} (ID: ${exForm.id})`"
      border
      class="m-b-24"
    >
      <template #extra>
        <bs-route-link :path="`/experiments/edit/${exForm.id}`" icon="Edit">
          {{ $t("button.edit") }}
        </bs-route-link>
        <bs-route-link path="/experiments/list" type="danger">
          <el-icon><CaretLeft /></el-icon>
          {{ $t("button.back") }}
        </bs-route-link>
      </template>

      <el-descriptions-item :label="$t('datasetManagement.detail.development_stage')" align="center">
        {{ exForm.development_stage }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('datasetManagement.detail.organ')" align="center">
        {{ exForm.organ }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('datasetManagement.detail.cell_count')" align="center">
        {{ exForm.cell_count }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('datasetManagement.detail.data_type')" align="center">
        {{ exForm.data_type }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('datasetManagement.detail.file_format')" align="center">
        {{ exForm.file_format }}
      </el-descriptions-item>


      <template v-if="showMore">
        <el-descriptions-item :label="$t('datasetManagement.detail.sample_count')" align="center">
          {{ exForm.sample_count }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.data_publisher')" align="center">
          {{ exForm.data_publisher }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.data_update_year')" align="center">
          {{ exForm.data_update_year }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.file_count')" align="center">
          {{ exForm.file_count }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.file_total_size_gb')" align="center">
          {{ exForm.file_total_size_gb }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.file_acquired_size_gb')" align="center">
          {{ exForm.file_acquired_size_gb }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.associated_diseases')" align="center">
          {{ exForm.associated_diseases }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.experiment_platform')" align="center">
          {{ exForm.experiment_platform }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.fetch_url')" align="center">
          {{ exForm.fetch_url }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.project')" align="center">
          {{ exForm.project }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.paper_doi')" align="center">
          {{ exForm.paper_doi }}
        </el-descriptions-item>

        <el-descriptions-item :label="$t('datasetManagement.detail.paper_title')" align="center">
          {{ exForm.paper_title }}
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
      <!-- <el-menu-item :index="`${routePrefix}paradigm`">{{$t('experiments.tab.paradigm')}}</el-menu-item> -->
      <el-menu-item :index="`${routePrefix}file`">{{$t('term.file')}}</el-menu-item>
      <!-- <el-menu-item :index="`${routePrefix}subject`">{{$t('subject.text')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}equipment`">{{$t('experiments.tab.equipment')}}</el-menu-item>
      <el-menu-item :index="`${routePrefix}assistant`">{{$t('experiments.tab.assistant')}}</el-menu-item> -->
    </el-menu>
    <div class="m-t-16">
      <router-view/>
    </div>
  </el-card>
  
</template>
<script setup>
import BsRouteLink from "@/components/BsRouteLink.vue";

import { ref, provide, onMounted, computed, watchEffect } from "vue";
import { exDetailApi } from "@/api/datasetManagement";
import { storeToRefs } from "pinia";
import useMediaQuery from "@/stores/mediaQuery";
import { useRoute } from "vue-router";
import { useUtils } from "@/compositions/useUtils";
import { EXPERIMENT_TYPE, SUBJECT_TYPE } from "@/utils/common";

const props = defineProps({
  experiment_id: String 
});

const exForm = ref({
  experiment_id: "",
  description: "",
  species: "",
  paper_title: "",
  paper_doi: "",
  development_stage: "",
  file_format: "",
  sample_count: null,
  data_publisher: "",
  data_update_year: null,
  file_count: null,
  file_total_size_gb:null,
  file_acquired_size_gb:null,
  associated_diseases:"",
  organ:"",
  cell_count:null,
  data_type:"",
  experiment_platform:"",
  fetch_url:"",
  project:""
})

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


const activeName = ref()
const route = useRoute()
watchEffect(() => {
  activeName.value = route.fullPath
})


const { YES_OR_NO } = useUtils();

provide('exid', Number(props.experiment_id));

onMounted(async () => {
  exForm.value = await exDetailApi(props.experiment_id);
})


</script>