<template>
  <el-dialog
    :title="title"
    @closed="handleClose(formRef)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      ref="formRef"
      label-width="120px"
      :label-suffix="$t('colon')"
      :model="formModel"
      :rules="formRules"
    >
      <slot></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('update:modelValue', false)">{{ $t("button.cancel") }}</el-button>
        <el-button @click="confirmReset(formRef)">{{ $t("button.reset") }}</el-button>
        <el-button type="primary" @click="doSubmit(formRef)">{{ $t("button.submit") }}</el-button >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useUtils } from '@/compositions/useUtils';
import { useI18n } from 'vue-i18n';

const props = defineProps([
  "title" ,
  "doFormSubmit",
  "doFormReset",
  "formModel",
  "formRules",
  "onClose",
  "validator"
])

const formRef = ref()
const emits = defineEmits(["update:modelValue", "submit-success"]);

const { systemConfirm, resetForm } = useUtils();
const i18n = useI18n();
console.log('formRef', formRef)


const doSubmit = async (formRef) => {
  if(!formRef) return;
  if(!props.doFormSubmit) {
    emits("update:modelValue", false)
    return;
  }
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
    await props.doFormSubmit();
    emits("update:modelValue", false);
    emits("submit-success");
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

const handleClose = (formRef) => {
  if(props.onClose) {
    props.onClose();
  }
  handleReset(formRef);
}


</script>