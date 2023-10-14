<template> 
  <bs-dialog-form
    :title="$t('button.newUser')"
    :cu="false"
    v-model:form="userForm"
    :form-rules="rules"
    :form-submit-api="handleSubmit"
  >
    <el-form-item :label="$t('user.username')" prop="username">
      <el-input v-model="userForm.username"/>
    </el-form-item>
    <el-form-item :label="$t('user.staff_id')" prop="staff_id">
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
import BsDialogForm from '@/components/form/BsDialogForm.vue';

import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ACCESS_LEVEL } from '@/utils/common';
import { newUserApi } from '@/api/user';
import { encodePwd } from '@/utils/password';


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
    message: i18n.t("valid.require", {action: i18n.t("action.input"), field: i18n.t("user.staff_id")}),
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
    password: encodePwd(`${username}#brain#${staff_id}`) 
  })
}


</script>