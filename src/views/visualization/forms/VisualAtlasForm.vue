<template> 
<bs-dialog-form
  :title="$t('visualization.label.atlas')"
  v-model:form="atlasForm"
  :form-model="atlasForm"
  :form-rules="rules"
  :form-submit-api="handleSubmit"
  class="p-l-20 p-r-20"
> 
  <el-form-item prop="title">
    <template #label> 
      <span class="icon-label">
        <el-tooltip :content="$t('visualization.tooltip.title')">
          <bs-icon-img icon="QuestionFilled"/>
        </el-tooltip>
        {{ `${$t('visualization.properties.title')}${$t('colon')}` }}
      </span>
    </template>
    <el-input clearable v-model="atlasForm.title"/>
  </el-form-item>
  <el-form-item :label="$t('visualization.properties.specy')" prop="specy">
    <template #label> 
      <span class="icon-label">
        <el-tooltip :content="$t('visualization.tooltip.specy')">
          <bs-icon-img icon="QuestionFilled"/>
        </el-tooltip>
        {{ `${$t('visualization.properties.specy')}${$t('colon')}` }}
      </span>
    </template>
    <el-input clearable v-model="atlasForm.specy"/>
  </el-form-item>
  <el-form-item prop="name">
    <template #label> 
      <span class="icon-label">
        <el-tooltip :content="$t('visualization.tooltip.name')">
          <bs-icon-img icon="QuestionFilled"/>
        </el-tooltip>
        {{ `${$t('visualization.properties.name')}${$t('colon')}` }}
      </span>
    </template>
    <el-input clearable v-model="atlasForm.name"/>
  </el-form-item>
  <el-form-item :label="$t('visualization.properties.public')" prop="public">
    <el-radio-group v-model="atlasForm.public">
      <el-radio :label="true">{{ $t('label.yes') }}</el-radio>
      <el-radio :label="false">{{ $t('label.no') }}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item :label="$t('visualization.properties.team')" prop="team">
    <el-input clearable v-model="atlasForm.team"/>
  </el-form-item>
  <el-form-item :label="$t('visualization.properties.teamLeader')" prop="teamLeader">
    <el-input clearable v-model="atlasForm.teamLeader"/>
  </el-form-item>
  <el-form-item :label="$t('visualization.properties.url')" prop="url">
    <el-input clearable v-model="atlasForm.url"/>
  </el-form-item>

</bs-dialog-form>
</template>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const atlasForm = ref({
  name: "",
  title: "",
  specy: "",
  url: "",
  public: false,
  team: "",
  teamLeader: ""
})

const rules = reactive({
  name: [{ required: true, trigger: ["blur", "change"], message: "root directory name is required" }],
  title: [{ required: true, trigger: ["blur", "change"] }],
  specy: [{ required: true, trigger: ["blur", "change"] }],
  public: [{ required: true, trigger: ["blur", "change"] }],
})

const router = useRouter();

const handleSubmit = () => {
  const atlasId = 1;
  console.log('router', router);
  router.push(`/visualize/detail/${atlasId}`);
}

</script>