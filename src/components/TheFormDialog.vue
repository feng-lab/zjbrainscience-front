<template>
  <el-dialog
    :title="title"
    @closed="handleClose(formRef)"
  >
    <el-form
      ref="formRef"
      label-width="120px"
      :model="formModel"
      :rules="formRules"
    >
      <slot></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="doReset(formRef)">{{ $t("button.reset") }}</el-button>
        <el-button type="primary" @click="doSubmit(formRef)">{{ $t("button.submit") }}</el-button >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useUtils } from '@/compositions/useUtils';
import { resetForm } from '@/utils/form';
import { computed, onUpdated, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps([
  "title" ,
  "doFormSubmit",
  "doFormReset",
  "formModel",
  "formRules",
  "onClose"
])

const formRef = ref()
const emits = defineEmits("update:modelValue");

const { systemConfirm } = useUtils();
const i18n = useI18n();


const doSubmit = async (formRef) => {
  if(!formRef) return;
  if(!props.doFormSubmit) {
    emits("update:modelValue", false)
    return;
  }
  await formRef.validate((valid, fields) => {
    if(valid) {
      props.doFormSubmit()
      .then(() => {
        emits("update:modelValue", false)
      })
    } else {
      console.log("submit error!", fields)
    }
  });
}

const doReset = (formRef) => {
  systemConfirm(
    i18n.t("confirm.resetform"),
    () => {
      if(!formRef) return;
      props.doFormReset() ?? resetForm(formRef);
    }
  )
}

const handleClose = (formRef) => {
  if(props.onClose) {
    props.onClose();
  }
  resetForm(formRef);
}

</script>