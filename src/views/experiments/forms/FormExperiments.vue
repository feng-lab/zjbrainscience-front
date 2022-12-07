<template>
  <bs-form-dialog
    :title="$t('button.newEx')"
    :form-model="exForm"
    :form-rules="rules"
    :do-form-submit="doFormSubmit"
  >
    <el-form-item :label="$t('experiments.detail.exName')" prop="experimenttitle">
      <el-input 
        v-model="exForm.experimenttitle"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.exDesc')" prop="description">
      <el-input 
        type="textarea"
        autosize
        v-model="exForm.description"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.exType')" prop="experimenttype">
      <el-select v-model="exForm.experimenttype" style="width: 100%" clearable>
        <el-option label="SSVEP" value="SSVEP"/>
        <el-option label="MI" value="MI"/>
        <el-option label="Neuron Spike" value="Neuron Spike"/>
        <el-option label="P300" value="P300"/>
        <el-option label="Others" value="Others"/>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.noninvasive')" prop="Noninvasive">
      <el-radio-group v-model="exForm.Noninvasive">
        <el-radio label="Yes"> {{ $t("label.yes") }} </el-radio>
        <el-radio label="No"> {{ $t("label.no") }} </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.exLocal')" prop="location">
      <el-input 
        type="textarea"
        autosize
        v-model="exForm.location"
      />
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.date')" required>
      <el-col :xs=24 :sm="11">
        <el-form-item prop="startdate">
          <el-date-picker
            clearable
            :placeholder="$t('label.startTime')"
            type="datetime"
            style="width: 100%"
            v-model="exForm.startdate"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2" class="text-center">
        <span>-</span>
      </el-col>
      <el-col :xs="24" :sm="11">
        <el-form-item prop="enddate">
          <el-date-picker
            clearable
            :placeholder="$t('label.endTime')"
            type="datetime"
            style="width: 100%"
            v-model="exForm.enddate"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.subjectType')" prop="subjecttype">
      <el-radio-group v-model="exForm.subjecttype">
        <el-radio label="人类">{{ $t("subject.category.human") }}</el-radio>
        <el-radio label="猕猴">{{ $t("subject.category.macaque") }}</el-radio>
        <el-radio label="犬">{{ $t("subject.category.dog") }}</el-radio>
        <el-radio label="猪">{{ $t("subject.category.pig") }}</el-radio>
        <el-radio label="其他">{{ $t("label.other") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.subjectCnt')" prop="subjectcounts">
      <el-input-number :min="1" v-model="exForm.subjectcounts"/>
    </el-form-item>
    <el-form-item :label="$t('experiments.detail.isopen')" prop="Isopen">
      <el-radio-group v-model="exForm.Isopen">
        <el-radio label="1">{{ $t("label.yes") }}</el-radio>
        <el-radio label="0">{{ $t("label.no") }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </bs-form-dialog>
</template>
<script setup>
import BsFormDialog from "@/components/BsFormDialog.vue";

import { reactive, ref } from "vue";
import { newExApi } from "@/api/experiments";
import { useRouter } from "vue-router";

const exForm = ref({
  experimenttitle: "",
  description: "",
  experimenttype: "SSVEP",
  Noninvasive: "Yes",
  location: "",
  startdate: "",
  enddate: "",
  subjecttype: "人类",
  subjectcounts: 1,
  Isopen: "1"
})

const router = useRouter();

const rules = reactive({
  experimenttitle: [{
    required: true,
    message: "请填写实验名称",
    trigger: "blur"
  }],
  description: [{
    required: true,
    message: "请填写实验描述",
    trigger: "blur"
  }],
  experimenttype: [{
    required: true,
    message: "请选择实验类型",
    trigger: "change"
  }],
  Noninvasive: [{
    required: true,
    message: "请选择是否无创",
    trigger: "change"
  }],
  location: [{
    required: true,
    message: "请填写实验地点",
    trigger: "blur"
  }],
  startdate: [{
    required: true,
    message: "请选择实验开始日期",
    trigger: "change"
  }],
  enddate: [{
    required: true,
    message: "请选择实验结束日期",
    trigger: "change"
  }],
  subjecttype: [{
    required: true,
    message: "请选择被试对象",
    trigger: "change"
  }],
  subjectcounts: [{
    required: true,
    message: "请选择被试对象数量",
    trigger: "change"
  }],
  Isopen: [{
    required: true,
    message: "请选择是否公开",
    trigger: "change"
  }]

})

const doFormSubmit = async () => {
  const id = await newExApi(exForm.value);
  router.push(`/experiments/${id}`)
}

</script>
<style lang="scss" scoped>
</style>