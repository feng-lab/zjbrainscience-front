<template>
  <el-dialog
    :title="formTitle"
    @closed="handleClose(formRef)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    v-loading="loading"
  >
    <el-form
      ref="formRef"
      label-width="120px"
      :label-suffix="$t('colon')"
      :model="form"
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
import { ref, computed, watch } from 'vue';
import { useUtils } from '@/compositions/useUtils';
import { useI18n } from 'vue-i18n';

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
const emits = defineEmits(["update:modelValue", "submit-success", "update:cuId", 'update:form']);
const cuType = ref("new");

const formTitle = computed(() => {
  const prefix = props.cu ? i18n.t(`button.${cuType.value}`) : "";
  const idStr = props.cu && cuType.value === "edit" ? `(ID: ${props.cuId})` : "";
  return `${prefix}${props.title}${idStr}`
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
  if(formValid && (!props.validator || customValid)) {
    const method = props.cu && cuType.value === "edit" ? props.formUpdateApi: props.formSubmitApi;
    const res = await method(props.form);
    emits("update:modelValue", false);
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
  props.formResetApi && props.formResetApi();
  resetForm(formRef);
}

const handleClose = (formRef) => {
  if(props.onClose) {
    props.onClose();
  }
  cuType.value = "new";
  emits("update:cuId", null);
  handleReset(formRef);
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