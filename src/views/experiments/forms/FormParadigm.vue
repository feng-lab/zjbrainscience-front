<template>
  <bs-dialog-form
    :title="$t('paradigm.text')"
    :form-submit-api="() => handleSubmit()"
    :form-update-api="() => handleSubmit(true)"
    :form-reset-api="handleReset"
    :form-detail-api="handleDetail"
    :onClose="handleClose"
    @submit-success="handleSubmitSuccess"
    v-model:form="paradigmForm"
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
        v-model="paradigmForm.description"
      />
    </el-form-item>
    <el-dialog 
      v-model="dialogVisible" 
      width="80%"
      append-to-body
    >
      <div class="preview">
        <img class="preview-image" :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </bs-dialog-form>
</template>
<script setup>
import BsDialogForm from '@/components/form/BsDialogForm.vue';

import { inject, ref } from "vue";
import { useUpload } from "@/compositions/useUpload";
import { newParadigmApi, paradigmDetailApi, updateParadigmApi } from "@/api/paradigm.js";
import { deleteFileApi } from "@/api/files.js";
import { getPreviewUrl } from '@/utils/common';
import { useI18n } from "vue-i18n";
import { ElMessage } from 'element-plus';

const i18n = useI18n();


const experiment_id = inject("exid");

const { files, options } = useUpload(experiment_id);

const paradigmForm = ref({
  description: "",
  experiment_id
});

const modelClosed = ref(false);


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleSubmit = (update) => {
  const { description } = paradigmForm.value;
  if( !description && files.value.length === 0) {
    ElMessage.error(i18n.t("valid.newParadigm"));
    return Promise.reject();
  }
  const images = files.value.map(file => file.id);
  let params = { 
    images,
    ...paradigmForm.value,
  }
  if(update) {
    const { creator } = paradigmForm.value; 
    return updateParadigmApi({
      ...params,
      creator: creator.id
    });
  } else {
    return newParadigmApi(params);
  }
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = getPreviewUrl(uploadFile.id);
  dialogVisible.value = true;
}

const handleDetail = async (id) => {
  const { images, ...paradigm } = await paradigmDetailApi(id);
  files.value = images.map(id => ({id, url: getPreviewUrl(id) }));
  return Promise.resolve(paradigm);
}

const handleSubmitSuccess = (res) => {
  const { id } = paradigmForm.value;
  if(!id && res) {
    paradigmForm.value.id = res;
  } 
}

const clearUploadedFiles = () => {
  console.log('files: ', files.value)
  console.log('need delete files')
  files.value.forEach(async (file) => {
    await deleteFileApi(file.id);
  })
}

const handleClose = () => {
  const { id } = paradigmForm.value;
  console.log('paradigm id: ', id, files.value.length && !id)
  if(files.value.length && !id ) {
    clearUploadedFiles();
  }
}


const handleReset = (afterClose) => {
  console.log('reset after close ? ', afterClose)
  if(!afterClose) {
    clearUploadedFiles();
  }
  paradigmForm.value= {
    ...paradigmForm.value,
    description: ""
  };
  files.value = [];
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