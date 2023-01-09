<template>
  <el-row class="m-b-16" :gutter="16">
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('term.file') + $t('colon')"> 
        <el-tag>
        {{ file.name }}
        </el-tag>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="6" class="m-b-8">
      <el-button 
        @click="channelSelect=true"
      >{{ $t("button.channel")}}</el-button>
    </el-col>
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('label.window') + $t('colon')">
        <el-select v-model="query.window" style="width: 100%">
          <el-option label="1秒" :value="1"/>
          <el-option label="2秒" :value="2"/>
          <el-option label="5秒" :value="5"/>
          <el-option label="10秒" :value="10"/>
        </el-select>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('label.currentPage') + $t('colon')">
        <el-input-number v-model="query.page_index" :min="0" style="width: 100%"/>
      </bs-field>
    </el-col>
  </el-row>
  <div v-if="channelSelect" class="channel-select"> 
    <div class="channel-select-button">
      <el-button 
        class="right"
        size="small" 
        link type="primary" 
        @click="channelSelect=false"
      >
        {{ $t("button.collapse") }}
        <el-icon><ArrowUp/></el-icon>
      </el-button>
      <el-button 
        class="right m-r-8"
        v-if="multiple"
        size="small" 
        link type="primary" 
        @click="query.channel=[]"
      >
        {{ $t("button.clear") }}
      </el-button>
    </div>
    <el-checkbox-group v-model="query.channel" v-if="multiple"> 
      <el-checkbox
        v-for="ch in CHANNELS"
        :key="ch"
        :label="ch"
      />
    </el-checkbox-group>
    <el-radio-group v-model="query.channel" v-else>
      <el-radio
        v-for="ch in CHANNELS"
        :key="ch"
        :label="ch"
      />
    </el-radio-group>

  </div>
  <bs-eeg-display 
    :eeg-data="eegData" 
    v-bind="{
      chartHeight,
      toolBox,
      zoom
    }"
  />
</template>

<script setup>
import BsEegDisplay from '@/components/BsEegDisplay.vue';
import BsField from '@/components/BsField.vue';

import { computed, onMounted, ref, watch } from "vue";
import { eegDisplayApi } from "@/api/eeg";
import { CHANNELS } from "@/utils/common";

const props = defineProps({
  file: String,
  chartHeight: Number,
  toolBox: {
    type: Boolean,
    default: true,
  },
  zoom: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false 
  }
})

const eegData  = ref();
const channelSelect = ref(false);


const query = ref({
  channels: props.multiple ? CHANNELS: CHANNELS[0] ,
  page_index: 0,
  window: 5
})

const getEEG = async () => {
  if(props.file) {
    eegData.value = await eegDisplayApi({
      file_id: props.file.id,
      ...query.value
    });
  }
}
watch(() => ({
  file: props.file,
  query
}), getEEG, {
  immediate: true,
  deep: true
})


</script>
<style lang="scss" scoped>
.channel-select {
  background: var(--el-fill-color-light);
  padding: 12px 24px;
  border-radius: 8px;
  &-button {
    overflow: hidden;
  }

}
</style>