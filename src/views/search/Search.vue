<template>
  <el-card>
    <template #header>
      <div class="between-flex p-r-12">
        <span>
          {{ $t("search.card.signal") }}
        </span>
        <span class="center-flex" v-if="searchFile">
          <el-upload 
            v-bind="options"
            :multiple="false"
            :show-file-list="false" 
            :file-list="files"
            :on-success="handleUploadSuccess"
          >
            <el-button link class="m-r-12" type="primary">{{
              $t("button.upload")
            }}</el-button>
          </el-upload>
          <el-button link type="primary" @click="handleSelect">{{ $t("button.online") }}</el-button>
          <el-button link type="primary">{{ $t("button.search") }}</el-button>
        </span>
      </div>
    </template>
    <bs-eeg-view 
      v-if="searchFile"
      :file="searchFile"
      :chart-height="100"
      :tool-box="false"
    />
    <div v-else> 
      <el-empty
        :description="$t('label.nofile')"
        :image-size="64"
      >
        <span class="center-flex" v-if="!searchFile">
          <el-upload 
            v-bind="options"
            :multiple="false"
            :show-file-list="false" 
            :file-list="files"
            :on-success="handleUploadSuccess"
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
  <el-card :header="$t('search.card.result')" class="m-t-16"> 
    待实现
  </el-card>
  <bs-target-file
    v-model:visible="visible" 
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
const { files, options } = useUpload();
const uploadFile = ref([]);
const searchFile = ref();

watch(selectFile, () => {
  const { filename, filetype }= selectFile.value;
  searchFile.value = `${filename}.${filetype}`;
})

const handleSelect = () => {
  visible.value = true;
  loadSource();
}

const handleUploadSuccess = (response, uploadFile) => {
  searchFile.value = uploadFile.name;
}

</script>

<style lang="scss" scoped>
.length-input {
  width: 15%;
  margin-top: 4px;
}
</style>