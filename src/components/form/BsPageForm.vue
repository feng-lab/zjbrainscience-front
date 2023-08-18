<template>
  <el-card
    class="main-content"
    :header="header"
  >
    <div class="page-form">
      <el-form
        ref="formRef"
        label-width="120px"
        :label-suffix="$t('colon')"
        :model="formModel"
        :rules="formRules"
        :label-position="breakpoint === 'xs'? 'top': 'right'"
        v-bind="$attrs"
      >
        <slot></slot>
      </el-form>
      <div class="m-t-24 text-center" >
          <el-button @click="doCancel()">{{ $t("button.cancel") }}</el-button>
          <el-button @click="confirmReset(formRef)">{{ $t("button.reset") }}</el-button>
          <el-button type="primary" @click="doSubmit(formRef)">{{ $t("button.submit") }}</el-button >
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { useUtils } from '@/compositions/useUtils';
import { useI18n } from 'vue-i18n';
import useMediaQuery from '@/stores/mediaQuery';
import { storeToRefs } from 'pinia';

const props = defineProps([
  "header" ,
  "doFormSubmit",
  "doFormReset",
  "formModel",
  "formRules",
  "doCancel"
])

const formRef = ref()
const emits = defineEmits(["submit-success"]);
const { breakpoint } = storeToRefs(useMediaQuery());

const { systemConfirm, resetForm } = useUtils();
const i18n = useI18n();


const doSubmit = async (formRef) => {
  if(!formRef) return;
  if(!props.doFormSubmit)  return; 
  const promise = [
    Promise.resolve(formRef.validate()), 
  ];
  if(props.validator) {
    promise.push(
      Promise.resolve(props.validator())
    )
  }

  const [formValid, customValid] = await Promise.all(promise);
  if(formValid && (!props.validator || customValid)) {
    const res = await props.doFormSubmit();
    emits("submit-success", res);
  }
}

const confirmReset = (formRef) => {
  systemConfirm(
    i18n.t("confirm.resetform"),
    () => handleReset(formRef)
  )
}

const handleReset = (formRef) => {
  props.doFormReset && props.doFormReset();
  resetForm(formRef);
}

defineExpose({
  reset: ()=>handleReset(formRef.value)
})



</script>

<style lang="scss" scoped>
.page-form {
  @media only screen and (min-width: 768px) {
    width: 80%;
    margin: 0 auto;
    
  }
}
</style>