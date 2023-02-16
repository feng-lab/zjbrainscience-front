<template>
  <bs-dialog-form
    :title="$t('paradigm.text')"
    :form-submit-api="handleSubmit"
    :form-update-api="handleUpdate"
    :form-reset-api="handleReset"
    :form-valid-api="handleValid"
    :form-detail-api="handleDetail"
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
import BsDialogForm from '@/components/BsDialogForm.vue';

import { inject, ref } from "vue";
import { useUpload } from "@/compositions/useUpload";
import { newParadigmApi, paradigmDetailApi, updateParadigmApi } from "@/api/paradigm.js";
import { getPreviewUrl } from '@/utils/common';
import { useI18n } from "vue-i18n";

const i18n = useI18n();


const experiment_id = inject("exid");

const { files, options } = useUpload(experiment_id);

const paradigmForm = ref({
  description: "",
  experiment_id
});


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleValid = () => {
  const { description } = paradigmForm.value;
  if( !description && files.value.length === 0) {
    Promise.reject(i18n.t("valid.newParadigm"));
  }
  return true;
}

const getFinalForm = () => {
  const images = files.value.map(file => file.id);
  paradigmForm.value = { 
    images,
    ...paradigmForm.value,
  }
}


const handleUpdate = () => {
  getFinalForm();
  const { creator } = paradigmForm.value; 
  return updateParadigmApi({
    ...paradigmForm.value,
    creator: creator.id
  });
}

const handleSubmit = () => {
  getFinalForm();
  return newParadigmApi(paradigmForm.value);
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


const handleReset = () => {
  files.value = [];
  paradigmForm.value= {
    description: "",
    experiment_id
  };
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