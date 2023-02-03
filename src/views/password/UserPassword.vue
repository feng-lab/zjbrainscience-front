<template>
  <el-card class="main-content">
    <el-form
      ref="pwdFormRef"
      :model="pwdForm"
      status-icon
      :rules="rules"
      label-width="180px"
      :label-position="breakpoint === 'xs'? 'top': 'right'"
      :label-suffix="$t('colon')"
    >
      <el-form-item prop="current" :label="$t('password.current')">
        <el-input v-model="pwdForm.current" type="password" show-password clearable/>
      </el-form-item>
      <el-form-item prop="newPwd" :label="$t('password.new')">
        <el-input v-model="pwdForm.newPwd" type="password" show-password clearable/>
      </el-form-item>
      <el-form-item prop="confirm" :label="$t('password.confirm')">
        <el-input v-model="pwdForm.confirm" type="password" show-password clearable/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleReset(pwdFormRef)">{{$t('button.reset')}}</el-button>
        <el-button @click="handleSubmit(pwdFormRef)" type="primary">{{$t('button.submit')}}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { updatePasswordApi } from "@/api/user";
import { ElMessage } from "element-plus";
import useMediaQuery from "@/stores/mediaQuery";
import { storeToRefs } from "pinia";
import useUserStore from "@/stores/user";

const pwdFormRef = ref();
const pwdForm = reactive({
  current: "",
  newPwd: "",
  confirm: ""
})

const i18n = useI18n();
const { breakpoint } = storeToRefs(useMediaQuery());
const { doLogout } = useUserStore();

const confirmValid = (rule, value, callback) => {
  if(value === "") {
    callback(new Error(i18n.t("password.valid.confirmRequire")));
  } else if(value !== pwdForm.newPwd) {
    callback(new Error(i18n.t("password.valid.confirmWrong")));
  } else {
    callback();
  }
}

const rules = computed(() => ({
  current: [{ 
    required: true, 
    message: i18n.t("password.valid.currentRequire"),
    trigger: "blur"
  }],
  newPwd: [{ 
    required: true, 
    message: i18n.t("password.valid.newRequire"),
    trigger: "blur"
  }],
  confirm: [
    { 
      required: true, 
      message: i18n.t("password.valid.confirmRequire"),
      trigger: "blur"
    },
    { validator: confirmValid, trigger: "blur" }
  ]
}))

const handleReset = (formRef) => {
  if(!formRef) return;
  formRef.resetFields();
}

const handleSubmit = (formRef) => {
  if(!formRef) return;
  formRef.validate(async (valid) => {
    if(valid) {
      const { current, newPwd } = pwdForm;
      try{
        await updatePasswordApi({
          old_password: current,
          new_password: newPwd
        });
        ElMessage.success(i18n.t("elmessage.updatePasswordSuccess"));
        doLogout();
        handleReset(pwdFormRef.value);
      } catch(e) {
        console.log(e);
      }
    } else {
      console.log("error submit!");
      return false;
    }
  })
}


</script>