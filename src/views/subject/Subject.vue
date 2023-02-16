<template>
  <experiments-associate
    ref="subjectRef"
    :columns="columns"
    i18n-prefix="subject"
    :add-button-text="$t('button.newSubject')"
    :search-fields="searchFields"
    :list-api="getSubjectDatas"
    :delete-api="deleteHumanSubjectApi"
    :disassociate-api="disassociateSubjectApi"
    :associate-api="associateSubjectApi"
    :action-column-props="{
      fixed: 'right',
      width: actionColumnWidth
    }"
    id-key="user_id"
    list-path="/experiments/subject"
    @show-new-form="handleNew"
    @view-detail="handleShowForm"
  >
    <template #table>
      <el-table-column 
        prop="username" 
        align="center"
        :label="$t('subject.username')"
      >
        <template #default="{ row }">
          <span class="m-r-4">{{ row.username }}</span>
          <el-tooltip :content="$t('subject.loginTips', {user: row.username})" placement="top">
            <el-icon 
              class="copy-subject-tips"
              @click="() => handleCopy(row.username)"
            >
              <DocumentCopy/>
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </template>
    <subject-form 
      v-model="showForm" 
      v-model:cu-id="itemId"
      @submit-success="handleSubjectSubmitSuccess"
    />
  </experiments-associate>
</template>
<script setup>
import SubjectForm from "./SubjectForm.vue";

import { h, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { 
  humanSubjectApi, 
  deleteHumanSubjectApi,
  disassociateSubjectApi,
  associateSubjectApi
} from "@/api/subject"
import ExperimentsAssociate from "../experiments/ExperimentsAssociate.vue";
import { ABO_BLOOD_TYPE, objectToOptions } from "@/utils/common";
import { useUtils } from "@/compositions/useUtils";
import { ElMessageBox } from "element-plus";
import { useShowForm } from "@/compositions/useShowForm";
import { useAssociateToExperiment } from "@/compositions/useAssociateToExperiment";
import useMediaQuery from "@/stores/mediaQuery";

const i18n = useI18n();
const {GENDER, YES_OR_NO, MARITAL_STATUS, copyText} = useUtils();
const { breakpoint } = useMediaQuery();

const actionColumnWidth = computed(() => {
  return breakpoint === "xs" ? 100 : 200;
})
const { 
  showForm, 
  itemId, 
  handleShowForm 
} = useShowForm();

const {
  associateRef: subjectRef,
  handleNew,
  handleSubmitSuccess
} = useAssociateToExperiment(showForm, "user_id");

const columns = [
  "user_id", 
  "gender",
  "birthdate",
  "death_date",
  "abo_blood_type",
  "marital_status",
  "is_left_handed",
  "education",
  "occupation" 
];



const handleSubjectSubmitSuccess = async (res) => {
  await handleSubmitSuccess(res);
  if(res) {
    const { username, password } = res;
    ElMessageBox.confirm(
      h('div', null, [
        h('p', {style: { marginBottom: '8px' }}, i18n.t("subject.copyAccountInfo")),
        h('p', null, `username: ${username}`),
        h('p', null, `password: ${password}`)
      ]),
      i18n.t("subject.copyAccountTitle"),
      {
        confirmButtonText: i18n.t("button.copy"),
        cancelButtonText: i18n.t("button.cancel"),
        type: "info"
      }
    ).then(() => {
      const text = `username: ${username}\npassword: ${username}#brain#${username}`;
      copyText(text);
    })
  }
}

const getSubjectDatas = (params) => {
  return humanSubjectApi(params).then(res => {
    const { total, items } = res;
    return {
      total,
      items: items.map(item => ({
        ...item,
        gender: computed(() => GENDER.value[item.gender]),
        marital_status: computed(() => MARITAL_STATUS.value[item.marital_status]),
        is_left_handed: computed(() => YES_OR_NO.value[item.is_left_handed])
      }))
    }
  })
}
const searchFields = computed(() => ([{
  name: "gender",
  label: i18n.t("subject.gender"),
  searchType: "select",
  options: objectToOptions(GENDER.value)
}, {
  name: "abo_blood_type",
  label: i18n.t("subject.abo_blood_type"),
  searchType: "select",
  options: ABO_BLOOD_TYPE
}, {
  name: "marital_status",
  label: i18n.t("subject.marital_status"),
  searchType: "select",
  options: objectToOptions(MARITAL_STATUS.value)
}, {
  name: "is_left_handed",
  label: i18n.t("subject.is_left_handed"),
  searchType: "select",
  options: objectToOptions(YES_OR_NO.value)
}]));

</script>

<style lang="scss" scoped>
.copy-subject-tips {
  cursor: pointer;
}
</style>