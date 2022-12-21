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
        v-model="paradigmForm.description"
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
import { newParadigmApi, paradigmDetailApi } from "@/api/paradigm.js";
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


const experiment_id = inject("exid");
const filePath = inject("filePath");

const { files, options } = useUpload(experiment_id, filePath);

const paradigmForm = ref({
  description: ""
});


const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const doFormSubmit = () => {
  const { description } = paradigmForm.value;
  if( !description && files.value.length === 0) {
    ElMessage.error(i18n.t("valid.newParadigm"));
    return Promise.reject();
  }
  const images = files.value.map(file => file.id);
  return newParadigmApi({
    images,
    description: paradigmForm.value.description,
    experiment_id
  }).then(() => {
    emits("formClosed", true);
  })
}

const handlePictureCardPreview = (uploadFile) => {
  /*
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
  */
}

const handleOpen = async () => {
  const { paradigmId } = props;
  if(paradigmId) {
    loading.value = true;
    const res = await paradigmDetailApi(paradigmId);
    loading.value = false;
    files.value = res.images.map(url => ({ url }))
    paradigmForm.value.description = res.description;
    type.value = "edit";
  }
}

const handleClose = () => {
  type.value = "new";
  handleReset();
  emits("formClosed");
}

const handleReset = () => {
  files.value = [];
  paradigmForm.value.description= "";
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