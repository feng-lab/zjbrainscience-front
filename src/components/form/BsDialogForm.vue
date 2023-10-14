<template>
  <el-dialog
    :title="formTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      ref="formRef"
      label-width="auto"
      :label-suffix="$t('colon')"
      :model="form"
      :rules="formRules"
      v-loading="loading"
    >
      <slot></slot>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose(formRef)">{{ $t("button.cancel") }}</el-button>
        <el-button @click="()=>confirmReset(formRef)">{{ $t("button.reset") }}</el-button>
        <el-button type="primary" @click="doSubmit(formRef)">{{ $t("button.submit") }}</el-button >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUtils } from '@/compositions/useUtils';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: String ,
    default: ""
  },
  formSubmitApi: Function,
  formUpdateApi: Function,
  formResetApi: Function,
  formDetailApi: Function,
  form: Object,
  formRules: Object,
  onClose: Function,
  formValidApi: Function,
  cu: {
    type: Boolean,
    default: true 
  },
  cuId: [String, Number]
})

const loading = ref(false);

const formRef = ref();
const emits = defineEmits([
  "update:modelValue", 
  "submit-success", 
  "update:cuId", 
  "update:form",
  "cancel-submit"
]);
const cuType = ref("new");

const formTitle = computed(() => {
  const prefix = props.cu ? i18n.t(`button.${cuType.value}`) : "";
  const idStr = props.cu && cuType.value === "edit" ? `(ID: ${props.cuId})` : "";
  return `${prefix} ${props.title}${idStr}`
})

const { systemConfirm, resetForm } = useUtils();
const i18n = useI18n();


const doSubmit = async (formRef) => {
  if(!formRef) return;
  if(!(props.formSubmitApi || props.formUpdateApi)) {
    emits("update:modelValue", false)
    return;
  }
  const promise = [
    Promise.resolve(formRef.validate()), 
  ];
  if(props.formValidApi) {
    promise.push(
      Promise.resolve(props.formValidApi())
    )
  }

  const [formValid, customValid] = await Promise.all(promise);
  if(formValid && (!props.formValidApi || customValid)) {
    let method = props.formSubmitApi;
    let action = "submit";
    if( props.cu && cuType.value === "edit") {
      method = props.formUpdateApi;
      action = "update";
    }
    const res = await method(props.form);
    ElMessage.success(i18n.t(`elmessage.${action}Success`));
    emits("submit-success", res);
    handleClose(formRef);
  }
}


const confirmReset = (formRef) => {
  systemConfirm(
    i18n.t("confirm.resetform"),
    () => handleReset(formRef)
  )
}



const handleReset = (formRef, afterClose=false) => {
  props.formResetApi && props.formResetApi(afterClose);
  resetForm(formRef);
}

const handleClose = (formRef) => {
  if(props.onClose) {
    props.onClose();
  }
  emits("update:modelValue", false);
  cuType.value = "new";
  emits("update:cuId", null);
  handleReset(formRef, true);
}

watch(
  () => props.cuId,
  async (id) => {
    if(id) {
      cuType.value = "edit";
      loading.value = true;
      const detail = await props.formDetailApi(id);
      loading.value = false;
      emits("update:form", detail);
    }
  }
)


</script>