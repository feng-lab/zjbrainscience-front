<template>
  <el-row class="m-b-16" gutter="16">
    <el-col :lg="cardShow ? 8 : 24" :xs="24" class="m-b-16">
      <el-card 
        :header="cardShow ? '文件列表': ''"
        :class="[listType]"
        :shadow="cardShow ? 'always': 'never'"
        :body-style="cardShow ? {} : {padding: 0}"
      >
        <el-upload
          ref="uploadRef"
          v-model:file-list="files"
          v-bind="options"
          :on-preview="handlePreview"
          :on-change="handleChange"
          :accept="accept"
          :auto-upload="false"
          :class="[listType]"
        >
          <template #trigger> 
            <el-button type="primary" @click="handleBatchUpload" icon="Upload">批量上传</el-button>
            <el-button type="primary" @click="handleZipUpload" icon="UploadFilled">压缩上传</el-button>
          </template>
          <el-radio-group class="right" v-model="docType" @change="handleTypeChange">
            <el-radio-button label="ALL">{{ $t("button.all") }}</el-radio-button>
            <el-radio-button label="BDF">BDF</el-radio-button>
            <el-radio-button label="MP4">MP4</el-radio-button>
          </el-radio-group>
          <template #file="{file}"> 
            <div v-if="listType === 'picture'" class="picture-item"> 
              <div class="picture-item--thumbnail m-b-8">
                <img :src="getThumbnail(file)"/>
              </div>
              <div>
                {{ file.name }}
              </div>
              <span class="picture-item--actions">
                <span @click="handlePreview(file)"><el-icon><View /></el-icon></span>
                <span>
                  <a :underline="false" :download="file.name" :href="`${filePath}${file.name}`" >
                    <el-icon><Download/></el-icon>
                  </a>
                </span>
                <span @click="handleDelete(file)"><el-icon><Delete /></el-icon></span>
              </span>
            </div>
            <div v-else class="text-item">
              <div class="text-item--name" @click="handlePreview(file)"> 
                <el-icon class="text-item--name--icon"><Document/></el-icon>
                <span>{{ file.name }}</span>
              </div>
              <div class="text-item--percent"> 
                <el-progress :percentage="file.percentage ?? 100" :status="file.status"/>
              </div>
              <div class="text-item--actions"> 
                <el-button-group>
                  <el-button size="small">
                    <el-link :underline="false" :download="file.name" :href="`${filePath}${file.name}`" icon="Download"></el-link> 
                  </el-button>
                  <el-button icon="Delete" size="small" type="danger" @click="handleDelete(file)"></el-button>
                </el-button-group>
              </div>
            </div>
          </template>
        </el-upload>
        <div class="text-center" v-if="loadMore">
          <el-button type="danger" @click="loadEx('more')" :loading="loading">{{$t("button.load")}}{{$t("button.more")}}</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="listType === 'text' ? 16 : 24 " :xs="24">
      <el-scrollbar height="780px" ref="scrollRef" @scroll="handleScroll">
        <el-card v-if="viewFile" class="m-b-16">
          <template #header> 
            <div class="between-flex"> 
              <div>{{ `数据文件 - ${viewFile.name}` }}</div>
              <div class="eeg-file-control"> 
                <div> 
                  <span>时间窗口: </span>
                  <el-select v-model="t" @change="getEEG">
                    <el-option label="1秒" :value="1"/>
                    <el-option label="2秒" :value="2"/>
                    <el-option label="5秒" :value="5"/>
                    <el-option label="10秒" :value="10"/>
                  </el-select>
                </div>
                <div> 
                  <el-pagination
                    layout="prev,pager,next,slot"
                    :page-count="7"
                    :pager-count="3"
                    v-model:current-page="i"
                    @current-change="getEEG"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </template>
          <TheEegDisplay :eegData="eegData"/>
        </el-card>
        <el-card :header="`视频文件 - ${viewMp4.name}`" v-if="viewMp4">
          <div style="text-align: center;" id="videoPlay">
            <video :src="viewMp4.url" controls/>
          </div>
        </el-card>
      </el-scrollbar>
    </el-col>
  </el-row>
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
  
</template>
<script setup>
import { ref, inject, nextTick, onMounted, watch, computed } from "vue";
import jsCookie from "js-cookie";


import { ElMessage } from "element-plus";
import Thumbnail from "@/utils/thumbnail";
import { useUpload } from "@/compositions/useUpload";
import { docByPageApi, delDocApi } from "@/api/files";
import { eegDisplayApi } from "@/api/eeg";
import jszip from "jszip";
import { Download } from "@element-plus/icons-vue";
import { useUtils } from "@/compositions/useUtils";
import { useI18n } from "vue-i18n";

import TheEegDisplay from "@/components/TheEegDisplay.vue";

const eegData = ref();

const experimentid = inject("exid");
const fileList = ref([]);
const uploadRef = ref();
const crsftoken = jsCookie.get("csrftoken");
const { files, options } = useUpload(experimentid);
const accept = ref();
const showFileSelect = ref(false);
const forSelectFile = ref([]);
const selectedFile = ref([]);
const docType = ref("ALL")
const listType = ref("picture");
const filePath = "/testfile/";
const loadMore = ref(true);
const limit = 30;
let offset = 0;
const i18n = useI18n();

const mp4Ref = ref();
const scrollRef = ref();

const { systemConfirm } = useUtils();

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

/* eeg display param */
const t = ref(5);
const i = ref(1);

const cardShow = computed(() => listType.value === "text")

onMounted(() => {
  getDoc();
})

const getDoc = async () => {
  const res = await docByPageApi(experimentid, docType.value, offset, limit);
  if(res.length < limit) {
    loadMore.value = false;
  }
  files.value = [...res.map(file => ({
    name: file.name,
    url: `${filePath}${file.name}`
  })), ...files.value]
  offset = files.value.length;
}

const getEEG = async () => {
  console.log(viewFile.value.name);
  const [p1, c ] = viewFile.value.name.split(".");
  console.log('p1', p1, 'c', c)
  eegData.value = await eegDisplayApi({
    p1,
    t: t.value,
    i: i.value,
    c
  })
}

const handleTypeChange = () => {
  files.value = [];
  getDoc();
}


const zipTool = new jszip();

const getThumbnail = (file) => {
  const { name, url } = file;
  const extension = name.split(".").pop().toLowerCase();
  return Thumbnail[extension] ?? Thumbnail["unknown"];
}

const handleDelete = (file) => {
  systemConfirm(
    i18n.t("confirm.delFile", {file: file.name}),
    ()=>uploadRef.value.handleRemove(file)
  )
}

const handleUploadError = (error, uploadFile) => {
  ElMessage.error(`${uploadFile.name} 上传失败!`),
  console.log('error', error);
}

const handleZipUpload = () => {
  accept.value = "application/zip";
}

const handleBatchUpload = () => {
  accept.value = "";
}

const handleScroll = (data) => {
  console.log('scrolling', data)
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

const viewFileOp = {
  "mp4": (file) => {
    viewMp4.value = file
    if(viewFile.value) {
      nextTick(() => {
        scrollRef.value.setScrollTop(600);
      })
    }
  },
  "bdf": (file) => { 
    viewFile.value = file
    getEEG();
  }
}

const handlePreview = (file) => {
  const type = file.name.split('.').pop().toLowerCase();
  const operation = viewFileOp[type];
  console.log('type', type, operation)
  if(operation) {
    operation(file);
    listType.value = "text";
  } else {
    ElMessage.error("当前文件类型不支持在线解析查看");
  }
  console.log('viewMp4', viewMp4.value);
  console.log('viewFile', viewFile.value);
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
  min-height: 500px;
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
  gap: 8px;
  &--name {
    flex: 2;
    cursor: pointer;
  }
  &--percent {
    width:  60%;
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

:deep(.el-upload-list__item:hover .el-progress__text) {
  display: block;
}

.eeg-file-control {
  display: flex;
  align-items: center;
}

</style>