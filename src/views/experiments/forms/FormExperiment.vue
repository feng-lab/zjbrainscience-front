<template>
  <bs-page-form
    ref="experimentFormRef"
    :header="$t(`experiments.action.${type}`)"
    :form-model="exForm"
    :form-rules="rules"
    :do-form-submit="doFormSubmit"
    :do-cancel="handleCancel"
    label-width="180px"
  >
    <el-form-item :label="$t('experiments.detail.name')" prop="name">
      <el-input 
        v-model="exForm.name"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.type')" prop="type">
      <el-select v-model="exForm.type" style="width: 100%" clearable>
        <el-option 
          v-for="(label, value) in EXPERIMENT_TYPE"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.description')" prop="description">
      <el-input 
        type="textarea"
        autosize
        v-model="exForm.description"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.location')" prop="location">
      <el-input 
        type="textarea"
        autosize
        v-model="exForm.location"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.date')" required>
      <el-col :xs=24 :sm="11">
        <el-form-item prop="start_at">
          <el-date-picker
            clearable
            :placeholder="$t('label.startTime')"
            type="datetime"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="startDisabledDate"
            v-model="exForm.start_at"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2" class="text-center">
        <span>-</span>
      </el-col>
      <el-col :xs="24" :sm="11">
        <el-form-item prop="end_at">
          <el-date-picker
            clearable
            :placeholder="$t('label.endTime')"
            type="datetime"
            style="width: 100%"
            :disabled-date="endDisabledDate"
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="exForm.end_at"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.main_operator')" prop="main_operator"> 
      <el-select
        style="width: 100%"
        clearable
        v-model="exForm.main_operator"
        remote
        filterable
        :remote-method="handleMainOperatorSearch"
        :loading="mpLoading"
        :placeholder="$t('placeholder.userSearch')"
      >
        <el-option
          v-for="option in mainOperatorOptions"
          :key="option.value"
          v-bind="option"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.assistants')" prop="assistants" v-if="type === 'new'"> 
      <el-select
        style="width: 100%"
        clearable
        multiple
        v-model="exForm.assistants"
        remote
        filterable
        :remote-method="handleAssistantsSearch"
        :loading="assistantLoading"
        :placeholder="$t('placeholder.userSearch')"
      >
        <el-option
          v-for="option in assistantsOptions"
          :key="option.value"
          v-bind="option"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.neuron_source')" prop="neuron_source"> 
      <el-input
        v-model="exForm.neuron_source"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.stimulation_type')" prop="stimulation_type"> 
      <el-input
        v-model="exForm.stimulation_type"
      />
    </el-form-item>
    <el-row :gutter="16">
      <el-col :xs=24 :sm="12">
        <el-form-item :label="$t('experiments.detail.subject_type')" prop="subject_type">
          <el-radio-group v-model="exForm.subject_type">
            <el-radio
              v-for="stype in SUBJECT_TYPE"
              :key="stype"
              :label="stype"
            >
              {{ $t(`subject.category.${stype}`) }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('experiments.detail.subject_num')" prop="subject_num">
          <el-input-number 
            :min="1" 
            v-model="exForm.subject_num"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="$t('experiments.detail.session_num')" prop="session_num"> 
      <el-input-number
        :min="0" 
        v-model="exForm.session_num"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.trail_num')" prop="trail_num"> 
      <el-input-number
        :min="0" 
        v-model="exForm.trail_num"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.is_non_invasive')" prop="is_non_invasive">
      <el-radio-group v-model="exForm.is_non_invasive">
        <el-radio :label="true"> {{ $t("label.yes") }} </el-radio>
        <el-radio :label="false"> {{ $t("label.no") }} </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.is_shared')" prop="is_shared">
      <el-radio-group v-model="exForm.is_shared">
        <el-radio :label="true">{{ $t("label.yes") }}</el-radio>
        <el-radio :label="false">{{ $t("label.no") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="tags">
      <template #label>
        <span class="icon-label">
          {{ $t('experiments.detail.tags')}}
          <el-tooltip :content="$t('experiments.tagsTooltip')">
            <bs-icon-img icon="QuestionFilled"/>
          </el-tooltip>
          {{ $t('colon')}}
        </span>
      </template>
      <el-tag
        v-for="tag in exForm.tags"
        :key="tag"
        closable
        class="m-r-8"
        @close="handleTagClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if="inputTagVisible"
        ref="InputRef"
        v-model="inputValue"
        size="small"
        style="width: 20em"
        @keyup.enter="handleInputTagConfirm"
        @blur="handleInputTagConfirm"
      />
      <el-button v-else size="small" @click="showInputTag" icon="Plus">
        {{ $t('experiments.tagBtn') }}
      </el-button>

    </el-form-item>
  </bs-page-form>
</template>
<script setup>
import BsPageForm from "@/components/form/BsPageForm.vue";

import { ref, computed, watch, nextTick } from "vue";
import { newExApi, updateExApi, exDetailApi } from "@/api/experiments";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserSearch } from "@/compositions/useUserSearch";
import { EXPERIMENT_TYPE, SUBJECT_TYPE } from "@/utils/common.js";
import BsIconImg from "@/components/BsIconImg.vue";

const props = defineProps({
  experiment_id: null
})


const exForm = ref({
  name: "",
  description: "",
  type: "SSVEP",
  is_non_invasive: true,
  location: "",
  start_at: "",
  end_at: "",
  subject_type: "human",
  subject_num: 1,
  is_shared: true,
  main_operator: null,
  assistants: [],
  neuron_source: "",
  stimulation_type: "",
  session_num: 0,
  trail_num: 0,
  tags: new Set()
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
  name: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.name")
    }),
    trigger: "blur"
  }],
  description: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.description")
    }),
    trigger: "blur"
  }],
  type: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.type")
    }),
    trigger: "change"
  }],
  location: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.location")
    }),
    trigger: "blur"
  }],
  start_at: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.select"),
      field: i18n.t("label.startTime")
    }),
    trigger: "change"
  }],
  end_at: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.select"),
      field: i18n.t("label.endTime")
    }),
    trigger: "change"
  }],
  main_operator: [{
    required: true,
    message: i18n.t("valid.require", {
      action: i18n.t("action.input"),
      field: i18n.t("experiments.detail.main_operator")
    }),
    trigger: "change"
  }],
}))

const endDisabledDate = (time) => {
  return time.getTime() < new Date(exForm.value.start_at).getTime();
}

const startDisabledDate = (time) => {
  return time.getTime() > new Date(exForm.value.end_at).getTime();
}

const doFormSubmit = async () => {
  const remoteFunc = type.value === "new" ? newExApi : updateExApi;
  const id = await remoteFunc({
    ...exForm.value,
    tags: [...exForm.value.tags]
  });
  const exId = id ?? props.experiment_id;
  router.push(`/experiments/detail/${exId}`)
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
      const { main_operator, tags } = res;
      exForm.value = {
        ...res,
        main_operator: main_operator.id,
        assistants: [],
        tags: new Set(tags) 
      }
      mainOperatorOptions.value.push({
        value: main_operator.id,
        label: `${main_operator.username}(${main_operator.staff_id})`
      })
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

const handleTagClose = (tag) => {
  exForm.value.tags.delete(tag);
}

const showInputTag = () => {
  inputTagVisible.value = true;
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

const handleInputTagConfirm = () => {
  if(inputValue.value) {
    exForm.value.tags.add(inputValue.value);
  }
  inputTagVisible.value = false;
  inputValue.value = "";
}

</script>