<template> 
  <bs-dialog-form
    :title="$t('button.new')+$t('user.text')"
    :form-model="userForm"
    :form-rules="rules"
    :do-form-submit="handleSubmit"
  >
    <el-form-item :label="$t('user.username')" prop="username">
      <el-input v-model="userForm.username"/>
    </el-form-item>
    <el-form-item :label="$t('user.staffId')" prop="staff_id">
      <el-input v-model="userForm.staff_id"/> 
    </el-form-item>
    <el-form-item :label="$t('user.accessLevel') " prop="access_level">
      <el-select v-model="userForm.access_level">
        <el-option
          v-for="level in ACCESS_LEVEL"
          :key="level"
          :value="level"
          :label="$t(`auth.${level}`)"
        />
      </el-select>
    </el-form-item>
  </bs-dialog-form>

</template>

<script setup> 
import BsDialogForm from '@/components/BsDialogForm.vue';

import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ACCESS_LEVEL } from '@/utils/common';
import { newUserApi, userInfoApi } from '@/api/user';


const i18n = useI18n();

const userForm = ref({
  username: "",
  staff_id: "",
  access_level: null
})

const rules = reactive({
  username: [{ 
    required: true, 
    message: i18n.t("valid.require", {action: i18n.t("action.input"), field: i18n.t("user.username")}),
    trigger: "blur"
  }],
  staff_id: [{ 
    required: true, 
    message: i18n.t("valid.require", {action: i18n.t("action.input"), field: i18n.t("user.staffId")}),
    trigger: "blur"
  }],
  access_level: [{ 
    required: true, 
    message: i18n.t("valid.require", {action: i18n.t("action.select"), field: i18n.t("user.accessLevel")}), 
    trigger: "change"
  }],
})



const handleSubmit = async () => {
  const { username, access_level, staff_id } = userForm.value;
  return newUserApi({
    username, 
    staff_id,
    access_level,
    account_type: "admin",
    password: `${username}#brain#${staff_id}` 
  })
}


</script>