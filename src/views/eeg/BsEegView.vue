<template>
  <el-row class="m-b-16" :gutter="16">
    <el-col :xs="24" :sm="6" class="m-b-8">
      <bs-field :label="$t('term.file')"> 
        <el-tag>
        {{ file.name }}
        </el-tag>
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="8" class="m-b-8">
      <bs-field :label="$t('label.window')">
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
      <bs-field :label="$t('label.currentPage')">
        <el-input-number v-model="query.page_index" :min="0" style="width: 100%"/>
      </bs-field>
    </el-col>
    <el-col :span="24" class="m-b-8" v-if="fileType === 'nev'">
      <bs-field :label="$t('button.channel')">
        <el-cascader
          v-model="nevAnalogSignal"
          @change="handleChange"
          :props="cascaderProps"
          collapse-tags
          clearable
          collapse-tags-tooltip
          style="width: 60%"
          class="m-r-8"
        />
        <el-tree-select
          v-model="nevSelectedChannels"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :data="nevChannels"
          show-checkbox
          filterable
        />
      </bs-field>
    </el-col>
    <el-col :xs="24" :sm="4" class="m-b-8" v-else>
        <el-button 
          @click="channelSelect=true"
          style="width: 100%"
        >{{ $t("button.channel")}}</el-button>
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
      <el-empty :description="$t('button.channel')" v-if="!eegData" :style="{height: `${chartHeight}px`}"/>
      <bs-eeg-display 
        v-else
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

import { computed, onMounted, reactive, ref, watch } from "vue";
import { eegDisplayApi, eegChannelsApi } from "@/api/eeg";
import { neuroSpikeFileInfoApi, displayNeuroSpikeFileApi } from "@/api/files";
import lodashUtil from "lodash/util";
import { useI18n } from 'vue-i18n';

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
  },
  fileType: String,
})

const eegData  = ref();
const channelSelect = ref(false);
const loading = ref(false);
const channels = ref([]);
const selectedChannels = ref([]);
let nevFileData = null;
const nevInfoMap = {};
const nevAnalogSignal = ref([]);
const i18n = useI18n();
const nevChannels = ref([]);
const nevSelectedChannels = ref([]);


const query = ref({
  page_index: 0,
  window: 5
})


const handleChange = (value) => {
  if(value) {
    let [block_index, segment_index, analog_signal_index] = value;
    let channelCount = nevFileData.blocks[block_index]
                                  .segments[segment_index]
                                  .analog_signals[analog_signal_index]
                                  .channel_count;
    nevChannels.value = [{
      value: "",
      label: i18n.t("button.checkall"),
      children: lodashUtil.range(channelCount).map((ch) => ({
        value: ch,
        label: `Channel ${ch}`
      }))
    }];
  }
}



const getEEG = async () => {
  if(!props.file) return;
  if(!channels.value.length && !nevSelectedChannels.value.length) return;
  let param = {
    file_id: props.file.id,
    ...query.value
  }
  let extraParam = {
    channels: channels.value
  }
  let getDataApi = eegDisplayApi;
  if(props.fileType === "nev") {
    let [block_index=0, segment_index=0, analog_signal_index=0] = nevAnalogSignal.value;
    extraParam = {
      block_index,
      segment_index,
      analog_signal_index,
      channel_indexes: nevSelectedChannels.value
    }
    getDataApi = displayNeuroSpikeFileApi;
    selectedChannels.value = nevSelectedChannels.value.map(ch => `channel ${ch}`);
  }

  loading.value = true;
  eegData.value = await getDataApi({
    ...param,
    ...extraParam
  });
  loading.value = false;
}

const getEEGChannel = async () => {
  if(props.file) {
    channels.value = await eegChannelsApi(props.file.id);
    selectedChannels.value = channels.value;
  }
}

const cascaderProps = {
  lazy: true,
  lazyLoad: (node, resolve) => {
    let waitTime = nevFileData ? 0 : 5000;
    setTimeout(()=>{
      let labelTree = ['blocks', 'segments', 'analog_signals'];
      const { level, pathValues } = node ;
      let prevObj = nevFileData;
      let i = 0;
      let resultArr = [];
      for(; i < level; i++) {
        let mapKey = pathValues.slice(0, i+1).join('_');
        prevObj = prevObj[labelTree[i]][nevInfoMap[mapKey]];
      }
      let _label = labelTree[i];
      let nodeArr = prevObj[_label];
      nodeArr.forEach((node, index) => {
        let value = node[`${_label.slice(0, _label.length-1)}_index`];
        let mapKey = [...pathValues, value].join('_');
        if(mapKey.startsWith('_')) mapKey = mapKey.slice(1);
        nevInfoMap[mapKey] = index;
        resultArr.push({
          value,
          label: `${_label.charAt(0).toUpperCase() + _label.slice(1)} ${value}`,
          leaf: level >= 2
        })
      })
      resolve(resultArr)
    }, waitTime);
  }
}

watch (
  () => props.file, 
  async () => {
    eegData.value = null;
    nevChannels.value = [];
    nevSelectedChannels.value = []
    if(props.fileType === "nev") {
      loading.value = true;
      nevFileData = await neuroSpikeFileInfoApi(props.file.id);
      loading.value = false;
    } else {
      await getEEGChannel();
      await getEEG();
    }
  },
  { immediate: true }
);

watch([query, nevSelectedChannels], getEEG, {
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