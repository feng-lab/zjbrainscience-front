<template>
  <TheFormDialog
    :title="title"
    :form-model="subjectForm"
    :do-form-submit="handleSubmit"
    :on-close="handleClose"
  >
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.id')}${$t('colon')}`" prop="subjectid">
          <el-input
            v-model="subjectForm.subjectid"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.gender')}${$t('colon')}`" prop="gender">
          <el-select
            style="width: 100%"
            v-model="subjectForm.gender"
          >
            <el-option :label="$t('label.male')" value="男"></el-option>
            <el-option :label="$t('label.female')" value="女"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.birth')}${$t('colon')}`" prop="birthdate">
          <el-date-picker
            v-model="subjectForm.birthdate"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.death')}${$t('colon')}`" prop="deathdate">
          <el-date-picker
            v-model="subjectForm.deathdate"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.education')}${$t('colon')}`" prop="education">
          <el-input
            v-model="subjectForm.education"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.occupation')}${$t('colon')}`" prop="occupation">
          <el-input
            v-model="subjectForm.occupation"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.phone')}${$t('colon')}`" prop="cellphonenumber">
          <el-input
            v-model="subjectForm.cellphonenumber"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item :label="`${$t('subject.email')}${$t('colon')}`" prop="inputemail">
          <el-input
            v-model="subjectForm.inputemail"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="`${$t('subject.marriage')}${$t('colon')}`" prop="marriagestatus">
      <el-select
        v-model="subjectForm.marriagestatus"
        style="width: 100%"
      >
        <el-option :label="$t('label.yes')" value="是"></el-option>
        <el-option :label="$t('label.no')" value="否"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="`${$t('subject.blood')}${$t('colon')}`" prop="abobloodtype">
      <el-select
        v-model="subjectForm.abobloodtype"
        style="width: 100%"
      >
        <el-option label="A" value="A"></el-option>
        <el-option label="B" value="B"></el-option>
        <el-option label="O" value="O"></el-option>
        <el-option label="AB" value="AB"></el-option>
        <el-option :label="$t('label.other')" value="其他"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="`${$t('subject.lefthand')}${$t('colon')}`" prop="lefthandflag">
      <el-select
        v-model="subjectForm.lefthandflag"
        style="width: 100%"
      >
        <el-option :label="$t('label.yes')" value="是"></el-option>
        <el-option :label="$t('label.no')" value="否"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="`${$t('subject.address')}${$t('colon')}`" prop="inputaddress">
      <el-input
        v-model="subjectForm.inputaddress"
      />
    </el-form-item>
  </TheFormDialog>
</template>
<script setup>
import { 
  inject, 
  ref, 
  watch, 
  computed 
} from "vue";
import { 
  humanSubjectDetailApi, 
  newHumanSubjectApi, 
  updateHumanSubjectApi 
} from "@/api/subject";
import { useI18n } from "vue-i18n";

import TheFormDialog from "@/components/TheFormDialog.vue";

const props = defineProps({
  subjectid: [String, Number]
})

const emits = defineEmits(["update:subjectid"])

const experimentsid = inject("exid");
const i18n = useI18n();

const type = ref("new");

const title = computed(() => {
  let res = `${i18n.t(`button.${type.value}`)}${i18n.t('subject.text')}`;
  if(type.value === "edit") {
    res += ` (ID: ${props.subjectid})`
  }
  return res;
})


const subjectForm = ref({
  subjectid: "",
  gender: "男",
  birthdate: "",
  deathdate: "",
  education: "",
  occupation: "",
  marriagestatus: "否",
  abobloodtype: "",
  lefthandflag: "否",
  cellphonenumber: "",
  inputemail: "",
  inputaddress: ""
})

watch(
  () => props.subjectid,
  async (subjectid, old) => {
    if(subjectid) {
      console.log('set type to edit')
      type.value = "edit";
      subjectForm.value = await humanSubjectDetailApi({ 
        subjectid,
        experimentsid
      })
    }
  }
)

const handleSubmit = () => {
  const method = type.value === "edit" ? updateHumanSubjectApi : newHumanSubjectApi; 
  return method(subjectForm.value)
}

const handleClose = () => {
  type.value = "new";
  emits("update:subjectid", null);
}




</script>