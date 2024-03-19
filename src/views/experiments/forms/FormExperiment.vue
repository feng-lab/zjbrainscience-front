<template>
  <bs-page-form
    ref="experimentFormRef"
    :header="$t(`datasetManagement.action.${type}`)"
    :form-model="exForm"
    :form-rules="rules"
    :do-form-submit="doFormSubmit"
    :do-cancel="handleCancel"
    label-width="200px"
  >
    <el-form-item :label="$t('datasetManagement.detail.description')" prop="description">
      <el-input 
        type="textarea"
        autosize
        v-model="exForm.description"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.species')" prop="species">
      <el-input 
        v-model="exForm.species"
        :placeholder="$t('datasetManagement.placeholder.species')"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.paper_title')" prop="paper_title">
      <el-input 
        v-model="exForm.paper_title"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.paper_doi')" prop="paper_doi">
      <el-input 
        v-model="exForm.paper_doi"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.development_stage')" prop="development_stage">
      <el-input 
        v-model="exForm.development_stage"
        :placeholder="$t('datasetManagement.placeholder.development_stage')"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.file_format')" prop="file_format">
      <el-input 
        v-model="exForm.file_format"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.sample_count')" prop="sample_count">
      <el-input 
        v-model="exForm.sample_count"
        :placeholder="$t('datasetManagement.placeholder.sample_count')"
        onkeyup="
          if( value>18446744073709551615 ) {
            value=18446744073709551615
          } 
          else if ( value<0 ) {
            value=0
          } else {
            value=value.replace(/^0+(\d)|[^\d]+/g,'')
          }"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.data_publisher')" prop="data_publisher">
      <el-input 
        v-model="exForm.data_publisher"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.data_update_year')" prop="data_update_year">
      <el-date-picker
        clearable
        :placeholder="$t('datasetManagement.placeholder.data_update_year')"
        type="date"
        style="width: 50%"
        value-format="YYYY-MM-DD"
        v-model="exForm.data_update_year"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.file_count')" prop="file_count">
      <el-input 
        v-model="exForm.file_count"
        :placeholder="$t('datasetManagement.placeholder.sample_count')"
        onkeyup="
          if( value>18446744073709551615 ) {
            value=18446744073709551615
          }else {
            value=value.replace(/^0+(\d)|[^\d]+/g,'')
          }
        "
        clearable
        maxlength="20"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.file_total_size_gb')" prop="file_total_size_gb">
      <el-input
        class="numberrule"
        type="number"
        :min="0" 
        v-model="exForm.file_total_size_gb"
        oninput=" if(value.length>1 && value[0] === '0' && value[1] !== '.') {value=value.slice(1)}" 
        clearable
        :placeholder="$t('datasetManagement.placeholder.file_total_size_gb')"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.file_acquired_size_gb')" prop="file_acquired_size_gb">
      <el-input
        class="numberrule"
        type="number"
        :min="0" 
        v-model="exForm.file_acquired_size_gb"
        oninput=" if(value.length>1 && value[0] === '0' && value[1] !== '.') {value=value.slice(1)}" 
        clearable
        :placeholder="$t('datasetManagement.placeholder.file_total_size_gb')"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.associated_diseases')" prop="associated_diseases">
      <el-input 
        v-model="exForm.associated_diseases"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.organ')" prop="organ">
      <el-input 
        v-model="exForm.organ"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.cell_count')" prop="cell_count">
      <el-input 
        v-model="exForm.cell_count"
        :placeholder="$t('datasetManagement.placeholder.sample_count')"
        onkeyup="
          if( value>18446744073709551615 ) {
            value=18446744073709551615
          }else {
            value=value.replace(/^0+(\d)|[^\d]+/g,'')
          }
        "
        clearable
        maxlength="20"
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.data_type')" prop="data_type">
      <el-input 
        v-model="exForm.data_type"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.experiment_platform')" prop="experiment_platform">
      <el-input 
        v-model="exForm.experiment_platform"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.fetch_url')" prop="fetch_url">
      <el-input 
        v-model="exForm.fetch_url"
        clearable
      />
    </el-form-item>

    <el-form-item :label="$t('datasetManagement.detail.project')" prop="project">
      <el-input 
        v-model="exForm.project"
        clearable
      />
    </el-form-item>
  </bs-page-form>
</template>
<script setup>
import BsPageForm from "@/components/form/BsPageForm.vue";

import { ref, computed, watch, nextTick } from "vue";
import { newExApi, updateExApi, exDetailApi } from "@/api/datasetManagement";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserSearch } from "@/compositions/useUserSearch";
import { EXPERIMENT_TYPE, SUBJECT_TYPE } from "@/utils/common.js";
import BsIconImg from "@/components/BsIconImg.vue";
import useUserStore from "@/stores/user";

const { user } = useUserStore();


const props = defineProps({
  experiment_id: null
})


const exForm = ref({
  user_id: user.id,
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

const experimentFormRef = ref();
const inputTagVisible = ref(false);
const inputValue = ref("");
const InputRef = ref();

const mainOperatorOptions = ref([]);
const { handleRemoteSearch:handleMainOperatorSearch , loading: mpLoading} = useUserSearch(mainOperatorOptions);

const assistantsOptions = ref([]);
const { handleRemoteSearch:handleAssistantsSearch, loading: assistantLoading } = useUserSearch(assistantsOptions);


const router = useRouter();

const type = computed(() => {
  console.log('experiment form router', router.currentRoute)
  return router.currentRoute.value.path.split('/')[2]
})

const i18n = useI18n();

const rules = computed(() => ({
  description: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.description")
    }),
    trigger: "blur"
  }]
}))

const doFormSubmit = async () => {
  const remoteFunc = type.value === "new" ? newExApi : updateExApi;
  await remoteFunc(exForm.value);
  // const id = await remoteFunc(exForm.value);
  // const exId = id ?? props.experiment_id;
  // router.push(`/experiments/detail/${exId}`)
}

const handleCancel = () => {
  experimentFormRef.value.reset();
  history.state.back ?  
    router.back() : 
    router.push("/experiments/list");
}

watch(() => props.experiment_id, async (experiment_id) => {
  if(props.experiment_id) {
    try {
      const res = await exDetailApi(experiment_id);
      exForm.value = res
    } catch(e) {
      router.push("/experiments/list");
    }
  }
}, {
  immediate: true
})

onBeforeRouteLeave((to, from) => {
  if(type.value === "edit") {
    experimentFormRef.value.reset();
  }
})

</script>


<style lang="css" scoped>

.numberrule :deep(input::-webkit-outer-spin-button),
.numberrule :deep(input::-webkit-inner-spin-button) {
    -webkit-appearance: none!important;
  }
.numberrule :deep(input[type="number"]) {
    -moz-appearance: textfield;
  }

  </style>