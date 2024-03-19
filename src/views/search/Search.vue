<template>
  <el-card>
    <template #header>
      <div class="between-flex p-r-12">
        <span>
          {{ $t("search.card.signal") }}
        </span>
        <span class="center-flex" v-if="searchFile">
          <el-upload 
            v-bind="{ ...options, 'on-success': handleUploadSuccess}"
            :multiple="false"
            :show-file-list="false" 
            :file-list="files"
          >
            <el-button class="m-r-12" type="primary">{{
              $t("button.upload")
            }}</el-button>
          </el-upload>
          <el-button type="primary" @click="handleSelect">{{ $t("button.online") }}</el-button>
          <el-button type="primary">{{ $t("button.search") }}</el-button>
        </span>
      </div>
    </template>
    <bs-eeg-view 
      v-if="searchFile"
      :file="searchFile"
      :chart-height="120"
      :tool-box="false"
    />
    <div v-else> 
      <el-empty
        :description="$t('label.nofile')"
        :image-size="64"
      >
        <span class="center-flex" v-if="!searchFile">
          <el-upload 
            v-bind="{ ...options, 'on-success': handleUploadSuccess}"
            :multiple="false"
            :show-file-list="false" 
            :file-list="files"
          >
            <el-button class="m-r-12" type="primary">
              {{ $t("button.upload") }}
            </el-button>
          </el-upload>
          <el-button type="primary" @click="handleSelect">{{ $t("button.online") }}</el-button>
          </span>
      </el-empty>
    </div>
  </el-card>
  <el-card :header="$t('search.card.result')" class="m-t-16" v-if="selectFile"> 
    <div v-for="r in results" :key="r.id" class="result">
      <div> 
        <span class="result-info">
          <el-icon class="m-r-12" color="#ff4d4f"><Flag/></el-icon>
          <span class="m-r-20">
            <span class="result-info-label">匹配分数： </span>
            <span class="result-info-value">{{r.scole }}</span>
          </span>
          <span class="m-r-20">
            <span class="result-info-label"> 文件名称：</span> 
            <span class="result-info-value">{{r.file_name}}</span>
          </span>
          <span class="m-r-20">
            <span class="result-info-label"> 实验ID：</span> 
            <span class="result-info-value">{{r.experiment_id}}</span>
          </span>
          <span class="result-action">
            <!-- <el-icon color="#52c41a"><View /></el-icon> -->
            <el-button icon="View" size="small"/>
          </span>
        </span>
      </div>
      <el-image :src="`http://127.0.0.1/atlasd/scripts/result/${r.id}.png`" />
    </div>
  </el-card>
  <bs-target-file
    v-model="visible" 
    v-model:selectFile="selectFile"
    :source="source"
  />
</template>

<script setup>
import BsEegView from "@/views/eeg/BsEegView.vue";

import { ref, computed, watch } from "vue";
import { useTargetFiles } from "@/compositions/useTargetFiles";
import { useUpload } from "@/compositions/useUpload";

const { source, visible, selectFile, loadSource} = useTargetFiles();
const { files, options } = useUpload(34);
const uploadFile = ref([]);
const searchFile = ref();

watch(selectFile, (file) => {
  const { filename, filetype }= selectFile.value;
  console.log('file', file);
  searchFile.value = file;
})

const handleSelect = () => {
  visible.value = true;
  loadSource();
}

const handleUploadSuccess = (response, uploadFile) => {
  console.log('upload success', uploadFile);
  searchFile.value = { ...uploadFile, id: response.data};
}

const results = [{
  id: 2,
  scole: 12.87,
  experiment_id: 34,
  file_name: 'data(2).bdf'
}, {
  id: 3,
  scole: 12.76,
  experiment_id: 35,
  file_name: 'data(3).bdf'
}, {
  id: 4,
  scole: 12.64,
  experiment_id: 36,
  file_name: 'data(4).bdf'
}]

</script>

<style lang="scss" scoped>
.length-input {
  width: 15%;
  margin-top: 4px;
}
.result {
  border-bottom: 1px solid var(--el-border-color);
  & > * {
    padding: 8px 12px;
  }

  &-info {
    display: flex;
    align-items: center;
    &-label {
      color: var(--el-text-color-secondary);
    }
    &-value {
      color: var(--el-text-color-regular);
      font-weight: bold;
    }
  }

  &-action {
    position: absolute;
    right: 0;
  }
}
</style>