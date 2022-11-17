<template>
  <el-card>
    <template #header>
      <div class="between-flex">
        <span>
          {{ $t("search.card.signal") }}
          <span v-if="selected">
            - {{ selected }}
          </span>
        </span>
        <span class="center-flex">
          <el-upload 
            :show-file-list="false" 
            :file-list="selectFile"
          >
            <el-button class="m-r-12" type="primary">{{
              $t("button.upload")
            }}</el-button>
          </el-upload>
          <el-button type="primary" @click="handleSelect">{{ $t("button.online") }}</el-button>
          <el-button type="primary" :disabled="!selected">{{ $t("button.search") }}</el-button>
        </span>
      </div>
    </template>
    <div class="between-flex">
      <span>
        <span class="m-r-4 m-b-16">{{ $t("label.channel") }}</span>
        <el-select class="m-r-16" v-model="chs">
          <el-option
            v-for="channel in CHANNELS"
            :key="channel"
            :value="channel"
            :label="channel"
          />
        </el-select>
        <span class="m-r-4">{{ $t("label.window") }}</span>
        <el-input-number class="length-input" v-model="start"/>
        <span class="m-r-8 m-l-8">-</span>
        <el-input-number class="length-input" v-model="end"/>
      </span>
      <span>
        <el-pagination
          layout="prev,pager,next,slot"
          :page-count="7"
          :pager-count="5"
        >
        </el-pagination>
      </span>
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
import { ref, computed } from "vue";
import { useTargetFiles } from "@/compositions/useTargetFiles";
import { CHANNELS } from "@/utils/common";

const currPage = ref(0);
const chs = ref(CHANNELS[0]);
const start = ref(0);
const end =ref(500);

const { source, visible, selectFile, handleSelect } = useTargetFiles();

const selected = computed(() => {
  const file = selectFile.value[0];
  return file ? `${file.filename}.${file.filetype}` : ""
})


</script>

<style lang="scss" scoped>
.length-input {
  width: 15%;
  margin-top: 4px;
}
</style>