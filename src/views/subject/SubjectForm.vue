<template>
  <bs-dialog-form
    v-model:form="subjectForm"
    :form-rules="rules"
    :title="$t('subject.text')"
    :form-model="subjectForm"
    :form-submit-api="newHumanSubjectApi"
    :form-update-api="updateHumanSubjectApi"
    :form-detail-api="humanSubjectDetailApi"
  >
    <el-row :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.gender')" prop="gender">
          <el-select
            style="width: 100%"
            v-model="subjectForm.gender"
          >
            <el-option 
              v-for="(label, value) in GENDER"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.abo_blood_type')" prop="abo_blood_type">
          <el-select
            v-model="subjectForm.abo_blood_type"
            style="width: 100%"
          >
            <el-option
              v-for="blood in ABO_BLOOD_TYPE"
              :key="blood"
              :value="blood"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.birthdate')" prop="birthdate">
          <el-date-picker
            clearable
            v-model="subjectForm.birthdate"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.death_date')" prop="death_date">
          <el-date-picker
            clearable
            v-model="subjectForm.death_date"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.education')" prop="education">
          <el-input
            v-model="subjectForm.education"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.occupation')" prop="occupation">
          <el-input
            v-model="subjectForm.occupation"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.phone_number')" prop="phone_number">
          <el-input
            v-model="subjectForm.phone_number"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="$t('subject.email')" prop="email">
          <el-input
            v-model="subjectForm.email"
            type="email"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="$t('subject.marital_status')" prop="marital_status">
      <el-select
        v-model="subjectForm.marital_status"
        style="width: 100%"
      >
        <el-option
          v-for="(label, value) in MARITAL_STATUS"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('subject.is_left_handed')" prop="is_left_handed">
      <el-select
        v-model="subjectForm.is_left_handed"
        style="width: 100%"
      >
        <el-option
          v-for="(label, value, index) in YES_OR_NO"
          :key="value"
          :value="!!index"
          :label="label"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('subject.address')" prop="address">
      <el-input
        v-model="subjectForm.address"
      />
    </el-form-item>
  </bs-dialog-form>
</template>
<script setup>
import BsDialogForm from "@/components/BsDialogForm.vue";

import { ref, reactive } from "vue";
import { 
  humanSubjectDetailApi, 
  newHumanSubjectApi, 
  updateHumanSubjectApi 
} from "@/api/subject";
import { useI18n } from "vue-i18n";
import { ABO_BLOOD_TYPE } from "@/utils/common";
import { useUtils } from "@/compositions/useUtils";


const i18n = useI18n();
const { GENDER, YES_OR_NO, MARITAL_STATUS } = useUtils();


const rules = reactive({
  "gender" : [{ required: true , trigger: ["blur", "change"]}],
  "abo_blood_type" : [{ required: true, trigger: ["blur", "change"] }],
  "birthdate" : [{ required: true, trigger: ["blur", "change"] }],
  "email": [{ type: "email", trigger: ["blur", "change"] }]
})


const subjectForm = ref({
  gender: "male",
  abo_blood_type: "",
  marital_status: "unmarried",
  is_left_handed: false,
  birthdate: "",
  death_date: "",
  education: "",
  occupation: "",
  phone_number: "",
  email: "",
  address: ""
})




</script>