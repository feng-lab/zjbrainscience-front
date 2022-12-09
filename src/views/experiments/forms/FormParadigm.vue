<template>
  <bs-dialog-form
    :title="title"
    :do-form-submit="doFormSubmit"
    :do-form-reset="handleReset"
    :form-model="paradigmForm"
    @open="handleOpen"
    @closed="handleClose"
    v-loading="loading"
  >
    <el-form-item :label="$t('paradigm.formlabel.image')">
      <el-upload
        ref="uploadRef"
        v-model:file-list="files"
        v-bind="options"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        multiple
    >
      <el-icon><Plus/></el-icon>
    </el-upload>

    </el-form-item>
    <el-form-item :label="$t('paradigm.formlabel.description')">
      <el-input 
        type="textarea"
        autosize
        v-model="paradigmForm.desc"
      />
    </el-form-item>
    <el-dialog 
      v-model="dialogVisible" 
      width="80%"
    >
      <div class="preview">
        <img class="preview-image" :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>

  </bs-dialog-form>
</template>
<script setup>
import BsDialogForm from '@/components/BsDialogForm.vue';

import { computed, inject, ref, toRef } from "vue";
import { useUpload } from "@/compositions/useUpload";
import { newParadigmApi, paradigmDetailApi } from "@/api/experiments";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

const props = defineProps({
  paradigmId: Number
})

const emits = defineEmits(["formClosed"]);
const loading = ref(false);

const i18n = useI18n();
const type = ref("new");
const title = computed(() => {
  let res = `${i18n.t(`button.${type.value}`)}${i18n.t('paradigm.text')}`;
  if(props.paradigmId) {
    res += ` (ID: ${props.paradigmId})`
  }
  return res;
})


const experimentid = inject("exid");
const filePath = inject("filePath");

const { files, options } = useUpload(experimentid);

const paradigmForm = ref({
  desc: "",
});


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const doFormSubmit = () => {
  const desc = paradigmForm.value.desc;
  if( !desc && files.value.length === 0) {
    ElMessage.error(i18n.t("valid.newParadigm"));
    return Promise.reject();
  }
  const imgUrl = files.value.map(file => `${filePath}${file.name}`);
  return newParadigmApi(
    imgUrl,
    paradigmForm.value.desc,
    experimentid
  ).then(() => {
    emits("formclosed", true);
  })
}
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const handleOpen = async () => {
  const { paradigmId } = props;
  if(paradigmId) {
    loading.value = true;
    const res = await paradigmDetailApi(experimentid, paradigmId);
    loading.value = false;
    files.value = res.imgUrl.map(url => ({ url }))
    paradigmForm.value.desc = res.desc;
    type.value = "edit";
  }
}

const handleClose = () => {
  console.log('close the dialog')
  type.value = "new";
  handleReset();
  emits("formclosed");
}

const handleReset = () => {
  files.value = [];
  paradigmForm.value.desc = "";
}

</script>

<style scoped lang="scss">
.preview {
  text-align: center;
  &-image {
    max-width: 100%;
    object-fit: fill;
  }
}
</style>