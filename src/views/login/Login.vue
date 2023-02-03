<template>
  <div class="login-page">
    <div class="login-page--header between-flex">
      <span>ZJLab BS database</span>
      <bs-lang-change/>
    </div>
    <el-row class="login-page--content" align="middle" :gutter="24">
      <el-col :xs="24" :sm="12" class="login-page--content--img">
        <img src="@/assets/img/login.png"/>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card>
          <el-form 
            style="margin-top: 24px"
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
          >
            <el-form-item prop="username">
              <template #label>
                <span class="hidden-xs-only">
                  {{ $t("label.username") }}{{$t("colon")}}
                </span>
              </template>
              <el-input 
                prefix-icon="UserFilled"
                :placeholder="$t('placeholder.input', { info: $t('label.username') })"
                v-model="loginForm.username"
                clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <template #label>
                <span class="hidden-xs-only">
                  {{ $t("label.password") }}{{$t("colon")}} 
                </span>
              </template>
              <el-input
                type="password"
                show-password
                @keyup.enter="submitLogin(loginFormRef)"
                prefix-icon="Lock"
                :placeholder="$t('placeholder.input', { info: $t('label.password') })"
                v-model="loginForm.password"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitLogin(loginFormRef)">{{$t("button.login")}}</el-button>
              <el-button @click="resetForm(loginFormRef)">{{$t("button.reset")}}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :xs="24" :sm="8">
        <bs-desc-card
          icon="Monitor"
          icon-color="#52c41a"
          :title="$t('loginInfoStorage.title')"
          :desc="$t('loginInfoStorage.desc')"
        />
      </el-col>
      <el-col :xs="24" :sm="8">
        <bs-desc-card
          icon="Management"
          icon-color="#52c41a"
          :title="$t('loginInfoManage.title')"
          :desc="$t('loginInfoManage.desc')"
        />
      </el-col>
      <el-col :xs="24" :sm="8">
        <bs-desc-card
          icon="DataAnalysis"
          icon-color="#52c41a"
          :title="$t('loginInfoAnalysis.title')"
          :desc="$t('loginInfoAnalysis.desc')"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import BsLangChange from '@/components/BsLangChange.vue';
import BsDescCard from '@/components/BsDescCard.vue';

import { computed, ref } from 'vue';
import { useUtils } from '@/compositions/useUtils';
import { useI18n } from 'vue-i18n';
import useUserStore from "@/stores/user";

const loginFormRef = ref();
const { doLogin, user } = useUserStore();
const loginForm = ref({
  username: user.username,
  password: ""
});

const { resetForm } = useUtils();



const i18n = useI18n();

const rules = computed(() => ({
  username: [{ 
    required: true, 
    message: i18n.t("valid.require", {field: i18n.t("label.username"), action: i18n.t("action.input")}),
    trigger: "blur" 
  }],
  password: [{ 
    required: true, 
    message: i18n.t("valid.require", {field: i18n.t("label.password"), action: i18n.t("action.input")}),
    trigger: "blur" 
  }]
}));




const submitLogin = async (formRef) => {
  if(!formRef) return;
  await formRef.validate((valid, fields) => {
    if(valid) {
      doLogin(loginForm.value);
    } else {
      console.log('login form validate failed', fields)
    }
  })
}

</script>
<style scoped lang="scss">
.login-page {
  margin: 0px auto;
  padding: 24px 16px;
  max-width: 1024px;
  &--header span{
    font-size: 32px;
    font-weight: 700;
  }

  &--content {
    margin: 24px auto;

    img {
      width: 100%;
      float: right;
      margin-bottom: 24px;
      animation: up-down 2s ease-in-out infinite alternate-reverse both;
    }
  }
}
.el-col {
  margin-bottom: 16px;
}

.el-form-item>:deep(.el-form-item__content:first-child) {
  margin-left: 120px;
  @media only screen and (max-width: 767px) {
    margin-left: 0px;
  }
}

:deep(.el-form-item__label) {
  width: 120px;
  @media only screen and (max-width: 767px) {
    width: 0px;
  }
}
:deep(.el-form-item__content .el-input) {
  @media only screen and (max-width: 767px) {
    margin-left: -12px;
    width: calc(100% + 12px);
  }
}

@-webkit-keyframes up-down {
  0% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}

@keyframes up-down {
  0% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(-10px);
  }
}

</style>