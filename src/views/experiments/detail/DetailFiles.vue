<template>
  <el-row class="m-b-16" :gutter="16">
    <el-col :lg="cardShow ? 8 : 24" :xs="24" class="m-b-16">
      <el-card 
        :header="cardShow ? $t('file.list'): ''"
        :class="cardShow? 'text' : 'picture'"
        :shadow="cardShow ? 'always' : 'never'"
        :body-style="cardShow ? {} : {padding: 0}"
      >
        <el-scrollbar :height="files.length?650:50" class="m-b-16">
        <el-upload
          ref="uploadRef"
          v-model:file-list="files"
          v-bind="options"
          :class="cardShow ? 'text' : 'picture'"
        >
          <template #trigger> 
            <el-button type="primary" icon="Upload" v-if="user.access_level > 10">{{ $t("button.bulkUpload")}}</el-button>
            <!--
            <el-button type="primary" @click="handleZipUpload" icon="UploadFilled">压缩上传</el-button>
            -->
          </template>
          <el-radio-group class="right" v-model="query.file_type" @change="handleTypeChange" v-if="files.length">
            <el-radio-button label="">{{ $t("button.all") }}</el-radio-button>
            <el-radio-button 
              v-for="type in fileTypeList"
              :key="type"
              :label="type"
            >
              {{ type.toUpperCase() }}
            </el-radio-button>
          </el-radio-group>
          <template #file="{file}"> 
            <div v-if="viewFile || viewMp4" :class="['text-item', file.id === viewFile?.id || file.id === viewMp4?.id ? 'viewing' : '']">
              <div class="text-item--name" @click="handlePreview(file)"> 
                <el-icon class="text-item--name--icon m-r-4"><Document/></el-icon>
                <span>{{ file.name }}</span>
              </div>
              <div class="text-item--percent"> 
                <el-progress :percentage="file.percentage ?? 100" :status="file.status"/>
              </div>
              <div class="text-item--actions"> 
                <el-button-group>
                  <el-button size="small">
                    <el-link :underline="false" :download="file.name" :href="getPreviewUrl(file.id)" icon="Download"></el-link> 
                  </el-button>
                  <el-button icon="Delete" size="small" type="danger" @click="handleDelete(file)"></el-button>
                </el-button-group>
              </div>
            </div>
            <div v-else class="picture-item"> 
              <div class="picture-item--thumbnail m-b-8 m-r-8">
                <img :src="getThumbnail(file)"/>
              </div>
              <div>
                {{ file.name }}
              </div>
              <span class="picture-item--actions">
                <span @click="handlePreview(file)"><el-icon><View /></el-icon></span>
                <span>
                  <a :underline="false" :download="file.name" :href="getPreviewUrl(file.id)">
                    <el-icon><Download/></el-icon>
                  </a>
                </span>
                <span @click="handleDelete(file)"><el-icon><Delete /></el-icon></span>
              </span>
            </div>

          </template>
        </el-upload>
        </el-scrollbar>
          <bs-load-more
            v-model="files"
            ref="loadMoreRef"
            :load-method="filesByPageApi"
            :limit="10"
            :height="50"
            :query="query"
          />
      </el-card>
    </el-col>
    <el-col :lg="16" :xs="24" v-if="viewFile||viewMp4">
      <el-scrollbar height="800px" ref="scrollRef">
        <el-card class="m-b-16" v-if="viewFile" :header="$t('file.eeg')">
          <bs-eeg-view
            :file="viewFile"
            :chart-height="700"
            multiple
          />
        </el-card>
        <el-card :header="`${$t('file.video')}- ${viewMp4.name}`" v-if="viewMp4">
          <div style="text-align: center;" id="videoPlay">
            <video :src="viewMp4.url" controls/>
          </div>
        </el-card>
      </el-scrollbar>
    </el-col>
  </el-row>
  <el-dialog 
    v-model="previewImg" 
    width="80%"
  >
    <div class="preview">
      <img class="preview-image" :src="previewImgUrl" alt="Preview Image" />
    </div>
  </el-dialog>
  <!--
  <el-dialog 
    v-model="showFileSelect" 
    title="选择压缩包中的文件"
    @closed="initSelect"
  >
    <el-checkbox 
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      {{ $t("button.checkall") }}
    </el-checkbox>
    <el-checkbox-group 
      v-model="selectedFile" 
      @change="handleFileSelectChange"
    >
      <el-checkbox
        v-for="file in forSelectFile"
        :key="file.name"
        :label="file"
      >
        {{ file.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer> 
      <el-button @click="showFileSelect = false">{{$t("button.cancel")}}</el-button>
      <el-button type="primary" @click="handleConfirm">{{$t("button.upload")}}</el-button>
    </template>
  </el-dialog>
  -->
  
</template>
<script setup>
import BsEegDisplay from "@/components/BsEegDisplay.vue";
import BsEegView from "@/views/eeg/BsEegView.vue";

import { ref, inject, nextTick, onMounted, computed } from "vue";
import jsCookie from "js-cookie";
import Thumbnail from "@/utils/thumbnail";
//import jszip from "jszip";
import { useUtils } from "@/compositions/useUtils";
import { useI18n } from "vue-i18n";
import { useUpload } from "@/compositions/useUpload";
import { ElMessage } from "element-plus";
import { filesByPageApi, deleteFileApi, fileTypesApi } from "@/api/files";
import { eegDisplayApi } from "@/api/eeg";
import { getPreviewUrl } from "@/utils/common";
import BsLoadMore from "@/components/BsLoadMore.vue";
import useUserStore from "@/stores/user";


const experiment_id = inject("exid");
const uploadRef = ref();
const { files, options } = useUpload(experiment_id);
const { user } = useUserStore();
//const accept = ref();
const showFileSelect = ref(false);
const forSelectFile = ref([]);
const selectedFile = ref([]);
//const fileType = ref("");
const fileTypeList = ref([]);
const i18n = useI18n();
const previewImg = ref(false);
const previewImgUrl = ref("");

const loadMoreRef = ref();

const scrollRef = ref();


const checkAll = ref(false);
const isIndeterminate = ref(false);
const handleCheckAllChange = (val) => {
  selectedFile.value = val ? forSelectFile.value : [];
  isIndeterminate.value = false;
}

const handleFileSelectChange = (value) => {
  const checkedCnt = value.length;
  const allFileCnt = forSelectFile.value.length;
  checkAll.value = checkedCnt === allFileCnt;
  isIndeterminate.value = checkedCnt > 0 && checkedCnt < allFileCnt;
}

const viewFile = ref();
const viewMp4 = ref();

const query = ref({
  experiment_id,
  file_type: ""
})

const cardShow = computed(() => viewFile.value || viewMp4.value);

onMounted(() => {
  getFileTypes();
})


const handleTypeChange = () => {
  loadMoreRef.value.handleLoadMore();
}

const getFileTypes = async () => {
  fileTypeList.value = await fileTypesApi(experiment_id);
}


//const zipTool = new jszip();

const getThumbnail = (file) => {
  const { id, name, url } = file;
  const extension = name.split(".").pop().toLowerCase();
  if(["png", "jpeg", "gif", "jpg"].includes(extension)) {
    return getPreviewUrl(id);
  }
  return Thumbnail[extension] ?? Thumbnail["unknown"];
}

const handleDelete = async (file) => {
  await uploadRef.value.handleRemove(file);
  if(viewFile.value?.id === file.id) {
    viewFile.value = null;
  }
  if(viewMp4.value?.id === file.id) {
    viewMp4.value = null;
  }
  setTimeout(getFileTypes, 200);
}

const handleSuccess = (response, uploadFile) => {
  uploadFile.id = response.data;
  getFileTypes();
}
options["on-success"] = handleSuccess;

/*
const handleZipUpload = () => {
  accept.value = "application/zip";
}

const handleBatchUpload = () => {
  accept.value = "";
}


const handleChange = (uploadFile, uploadFiles) => {
  if(!accept.value) {
    uploadRef.value.submit();
    return;
  } 
  uploadRef.value.handleRemove(uploadFile);
  if(accept.value !== uploadFile.raw.type ) {
    ElMessage.error("请上传zip文件")
    return;
  }
  if(uploadFile.raw.type === "application/zip") {
    accept.value = "";
    zipTool.loadAsync(uploadFile.raw)
    .then((zip) => {
      showFileSelect.value = true;
      zip.forEach(async (relativePath, zipEntry) => {
        const blob = await zip.file(zipEntry.name).async("blob");
        const file = new File([blob], zipEntry.name)
        forSelectFile.value.push(file);
      })
    })
  }
}
*/

const viewFileOp = {
  "mp4": (file) => {
    viewMp4.value = file.id === viewMp4.value?.id ? null : {
      ...file,
      url: getPreviewUrl(file.id)
    }
    if(viewMp4.value && viewFile.value) {
      nextTick(() => {
        scrollRef.value.setScrollTop(600);
      })
    }
  },
  "bdf": (file) => { 
    viewFile.value = file.id === viewFile.value?.id ? null : file
  },
  "png": (file) => {
    previewImg.value = true;
    previewImgUrl.value = getPreviewUrl(file.id);
  }
}

const handlePreview = (file) => {
  const { name } = file;
  const type = name.split('.').pop().toLowerCase();
  const operation = viewFileOp[type];
  if(operation) {
    operation(file);
  } else {
    ElMessage.error("当前文件类型不支持在线解析查看");
  }
}

const initSelect = () => {
  selectedFile.value = [];
  forSelectFile.value = [];
  checkAll.value = false;
  isIndeterminate.value = false;
}

const handleConfirm = () => {
  selectedFile.value.forEach(file => {
    file.uid = Date.now();
    uploadRef.value.handleStart(file);
  })
  showFileSelect.value = false;
}


</script>

<style lang="scss" scoped>
.el-card.is-never-shadow.picture {
  border: none;
}
.picture {
  min-height: 50vh;
  :deep(el-upload) {
    float: left;
  }
  :deep(.el-upload-list) {
    display: inline-flex;
    flex-wrap: wrap;
    margin: 0;
    position: absolute;
    left: 0;
    top: 48px;
  }
  :deep(.el-card) {
    border: none;
  }

  :deep(.el-upload-list__item) {
      overflow: hidden;
      width: 148px;
      height: 148px;
      box-sizing: border-box;
  }
  .picture-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &--thumbnail {
      height: 80%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &--actions {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      opacity: 0;
      font-size: 18px;
      background-color: var(--el-overlay-color-lighter);
      transition: opacity var(--el-transition-duration);
      &:hover {
        opacity: 1;
      }
      span {
        a {
          color: #fff;
        }
        cursor: pointer;
        &+span {
          margin-left: 1rem;
        }
      }
    }
  }
}
.text-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  gap: 8px;
  &--name {
    flex: 2;
    cursor: pointer;
  }
  &--percent {
    width:  40%;
    margin-right: 16px;
    .el-progress {
      top: -2px;
      right: 0;
    :deep(.el-progress-bar) {
      margin-right: 20px;
      width: 80%;
    }
    :deep(.el-progress__text) {
      top: -4px;
      min-width: 0;
      &:hover {
        display: block;
      }
    }
    }
  }
  &--actions {
    font-size: 0.8rem;
    span {
      cursor: pointer;
      &+span {
        margin-left: 0.5rem;
      }
    }
  }
}

.viewing {
  background-color: var(--el-color-primary-light-9);
}

:deep(.el-upload-list__item:hover .el-progress__text) {
  display: block;
}

.eeg-file-control {
  display: flex;
  align-items: center;
}

.preview {
  text-align: center;
  &-image {
    max-width: 100%;
    object-fit: fill;
  }
}

</style>