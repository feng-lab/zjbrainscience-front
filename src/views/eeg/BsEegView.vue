<template>
  <el-row class="m-b-16" :gutter="16">
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('term.file') + $t('colon')"> 
        <el-tag>
        {{ file.name }}
        </el-tag>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="8" class="m-b-8">
      <bs-field :label="$t('label.window') + $t('colon')">
        <el-select v-model="query.window" style="width: 100%">
          <el-option
            v-for="w in [1, 2, 5, 10]"
            :key="w"
            :value="w"
            :label="$t(`eeg.window.${w}`)"
          />
        </el-select>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('label.currentPage') + $t('colon')">
        <el-input-number v-model="query.page_index" :min="0" style="width: 100%"/>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="4" class="m-b-8">
      <bs-field>
      <el-button 
        @click="channelSelect=true"
        style="width: 100%"
      >{{ $t("button.channel")}}</el-button>
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
      <template v-if="multiple">
        <el-button 
          class="right m-r-8"
          size="small" 
          link type="primary" 
          @click="selectedChannels=channels"
        >
          {{ $t("button.checkall") }}
        </el-button>
        <el-button 
          class="right"
          size="small" 
          link type="primary" 
          @click="selectedChannels=[channels[0]]"
        >
          {{ $t("button.filter") }}
        </el-button>
      </template>
    </div>
    <el-checkbox-group v-model="selectedChannels" v-if="multiple"> 
      <el-checkbox
        v-for="ch in channels"
        :key="ch"
        :label="ch"
      />
    </el-checkbox-group>
    <el-radio-group v-model="selectedChannels" v-else>
      <el-radio
        v-for="ch in channels"
        :key="ch"
        :label="ch"
      />
    </el-radio-group>

  </div>
  <el-skeleton :loading="loading" animated style="width:100%" :rows="5">
    <template #default>
      <bs-eeg-display 
        :legends="selectedChannels"
        :eeg-data="eegData" 
        v-bind="{
          chartHeight,
          toolBox,
          zoom
        }"
      />
    </template>
  </el-skeleton>
</template>

<script setup>
import BsEegDisplay from '@/components/BsEegDisplay.vue';
import BsField from '@/components/BsField.vue';

import { computed, onMounted, ref, watch } from "vue";
import { eegDisplayApi, eegChannelsApi } from "@/api/eeg";

const props = defineProps({
  file: Object,
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
const loading = ref(false);
const channels = ref([]);
const selectedChannels = ref([]);


const query = ref({
  page_index: 1,
  window: 5
})
const getEEG = async () => {
  if(props.file) {
    loading.value = true;
    eegData.value = await eegDisplayApi({
      file_id: props.file.id,
      ...query.value,
      channels: channels.value
    });
    loading.value = false;
  }
}

const getEEGChannel = async () => {
  if(props.file) {
    channels.value = await eegChannelsApi(props.file.id);
    selectedChannels.value = channels.value;
  }
}
watch (
  () => props.file, 
  async () => {
    await getEEGChannel();
    await getEEG();
  },
  { immediate: true }
);

watch(query, getEEG, {
  deep: true
})


</script>
<style lang="scss" scoped>
.channel-select {
  background: var(--el-color-info-light-9);
  padding: 12px 24px;
  border-radius: 8px;
  &-button {
    overflow: hidden;
  }

}
</style>