<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="8" class="m-b-8">
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
    <el-col :xs="24" :sm="8" class="m-b-8">
      <bs-field :label="$t('label.currentPage')">
        <el-input-number v-model="query.page_index" :min="0" style="width: 100%"/>
      </bs-field>
    </el-col>
  </el-row>
  <div class="m-b-8">
    <bs-field :label="$t('button.channel')">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="16" v-if="fileType === 'nev'">
          <el-cascader
            v-model="nevAnalogSignal"
            @change="handleChange"
            :props="cascaderProps"
            collapse-tags
            clearable
            collapse-tags-tooltip
            style="width: 100%"
            class="m-b-8"
            :placeholder="$t('placeholder.select', { content: 'Analog Signal'})"
          />
      </el-col>
      <el-col :xs="24" :sm="fileType === 'nev' ? 8 : 24">
      <el-tree-select
        ref="treeSelectRef"
        v-model="selectedChannels"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :data="channels"
        show-checkbox
        filterable
        clearable
        node-key="value"
        :placeholder="$t('placeholder.select', { content: 'Channel'})"
        style="width: 100%"
        :default-expanded-keys="['all']"
      >
        <template #default="{ node, data}">
          <span class="channel-tree">
            <span>
              <span>{{ node.label }} </span>
              <span v-if="data.value === 'all'">{{ `(${data.children.length})`}}</span>
            </span>
            <span v-if="data.value === 'all' ">
              <a @click="handleClearChecked(node, data)">{{ $t("button.clear")}}</a>
            </span>
          </span>
        </template>
      </el-tree-select>
      </el-col>
      </el-row>
    </bs-field>
  </div>
  <el-skeleton :loading="loading" animated style="width:100%" :rows="5">
    <template #default>
      <el-empty :description="$t('button.channel')" v-if="!eegData" :style="{height: `${chartHeight}px`}"/>
      <bs-eeg-display 
        v-else
        :legends="selectedLengends"
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
import lodashArray from "lodash/array";
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

const treeSelectRef = ref();

const eegData  = ref();
const loading = ref(false);
const channels = ref([]);
const selectedChannels = ref([]);
const selectedLengends = ref([]);
let fetchNevChannels = [];
let fetchMode = false;

let nevFileData = null;
const nevInfoMap = {};
const nevAnalogSignal = ref([]);
const i18n = useI18n();

const emits = defineEmits(["closePreview"])



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
    channels.value = [{
      value: "all",
      label: i18n.t("button.checkall"),
      children: lodashUtil.range(channelCount).map((ch) => ({
        value: ch,
        label: `Channel ${ch}`
      }))
    }];
  }
}

const handleCheckedChange = async () => {
  const checkedChannels = treeSelectRef.value.getCheckedNodes(true)
                                             .map(ch => ch.value);
}

const handleClearChecked = () => {
  selectedChannels.value = [];
}



const getEEG = async () => {
  if(!props.file) return;
  if(!channels.value.length && !selectedChannels.value.length) return;
  let param = {
    file_id: props.file.id,
    ...query.value
  }
  let extraParam = {
    channels: selectedChannels.value
  }

  let getDataApi = eegDisplayApi;
  if(props.fileType === "nev") {
    let [block_index=0, segment_index=0, analog_signal_index=0] = nevAnalogSignal.value;
    extraParam = {
      block_index,
      segment_index,
      analog_signal_index,
      channel_indexes: fetchMode ? fetchNevChannels : selectedChannels.value
    }
    getDataApi = displayNeuroSpikeFileApi;
  }

  loading.value = true;
  let res = await getDataApi({
    ...param,
    ...extraParam
  });
  if(fetchMode) {
    eegData.value = {
      ...res,
      datasets: [...(eegData.value?.datasets ?? []), ...res.datasets]
    }
  } else {
    eegData.value = res;
  }
  loading.value = false;
  fetchMode = false;
  fetchNevChannels = [];
}

const getEEGChannel = async () => {
  if(props.file) {
    let res = await eegChannelsApi(props.file.id);
    channels.value = [{
      value: "all",
      label: i18n.t("button.checkall"),
      children: res.map(ch => ({
        label: ch,
        value: ch
      }))
    }]
    selectedChannels.value = res;
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
    channels.value = [];
    selectedChannels.value = []
    if(props.fileType === "nev") {
      loading.value = true;
      await neuroSpikeFileInfoApi(props.file.id).then(res => {
        nevFileData = res;
      }).catch(err => {
        emits("closePreview", true);
        return;
      });
      loading.value = false;
    } else {
      await getEEGChannel();
      await getEEG();
    }
  },
  { immediate: true }
);

watch(query , getEEG, {
  deep: true
})

watch(selectedChannels, (newValue) => {
  if(!newValue.length) return; 
  if(props.fileType === "nev" ) {
    let eegDatasets = eegData.value?.datasets.map(ds => Number(ds.name.split(" ")[1])) ?? [];
    fetchNevChannels = lodashArray.difference(newValue, eegDatasets);
    fetchNevChannels.length && (fetchMode = true) && getEEG();
    selectedLengends.value = newValue.map(ch => `channel ${ch}`);
  } else {
    selectedLengends.value = newValue;
  } 
})


</script>
<style lang="scss" scoped>
.channel-tree {
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: var(--el-color-primary)
  }
}
</style>
