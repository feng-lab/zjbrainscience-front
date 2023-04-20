<template>
  <div class="bs-atlas">
    <div class="atlas-widget bs-atlas-tooltip" v-if="selectedId">
      <bs-icon-img icon="Close" @click="selectedId = null" class="bs-atlas-tooltip-close-btn"/>
      <h1>ID: {{ selectedId }}</h1>
      <div v-for="key in ['Acronym', 'Description', 'Lobe', 'Gyrus']" :key="key">
        <template v-if="selectedLabelInfo[key]">
          <p class="icon-label"><bs-icon-img icon="Memo"/><strong>{{key}}</strong></p>
          <p>{{selectedLabelInfo[key]}}</p>
        </template>
      </div>
    </div>
    <el-row class="bs-atlas-visualize" justify="space-between">
      <el-col :span="6" class="label">
        <h1 class="atlas-title"> 
          {{ title }} 
        <p class="m-b-8">
          <el-link :href="site" target="_blank">{{ site }}</el-link>
        </p>
        </h1>
        <el-input 
          v-model="filterText" 
          placeholder="Filter keyword" 
          clearable
          class="atlas-input m-b-8"
        />
        <div class="atlas-widget">
        <el-scrollbar :max-height="725" class="tree-scroll">
          <el-tree
            ref="treeRef"
            :data="treeData"
            multiple
            node-key="id"
            show-checkbox
            @check-change="handleTreeValue"
            :filter-node-method="filterNode"
            :default-expanded-keys="['0']"
            class="atlas-widget-inner"
          />
        </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="17" class="neuro">
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
          @selected-segment-changed="handleSelectedSegmentChanged"
          @visible-segments-changed="handleVisibleSegmentsChanged"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";

import { onMounted, ref, watch } from "vue";
import BsIconImg from "./BsIconImg.vue";

const props = defineProps({
  treeData: {
    type:Array,
    default: [],
    required: true
  },
  layerName: {
    type: String,
    required: true
  },
  state: {
    type: Object,
    default: {},
    required: true
  },
  title: String,
  site: String,
  defaultVisible: {
    type: [Array, String],
    default: [],
    validator(value) {
      return typeof value === "string" ? value === "all" : true
    }
  }
})

const treeRef = ref();
const neuroRef = ref();
const selectedId = ref();
const selectedLabelInfo = ref({});
const filterText = ref("");
let labelIndices = {};


const handleTreeValue = () => {
  const ids = treeRef.value.getCheckedNodes(false, false)
                          .filter(node => Number(node.id))
                          .map(node => node.id);
  neuroRef.value.setVisibleSegments(props.layerName, ids);
}

const handleSelectedSegmentChanged = (segmentId, layer) => {
  if(props?.layerName === layer.name) {
    selectedId.value = segmentId;
    selectedLabelInfo.value = labelIndices[segmentId] ?? {};
  }
}

const handleVisibleSegmentsChanged = (segments, layer) => {
  if(props?.layerName === layer.name) {
    //treeRef.value.setCheckedKeys(segments);
  }
}


const filterNode = (value, data) => {
  if(!value) return true;
  return data.label?.includes(value) || String(data.id).includes(value);
}

watch(filterText, (value) => {
  treeRef.value.filter(value);
})

onMounted(() => {
  labelIndices = treeToIndices(props.treeData);
  let statedSegments = props?.state?.layers?.filter(layer => props?.layerName === layer.name)[0]?.segments;
  if(statedSegments?.length) {
    treeRef.value.setCheckedKeys(statedSegments);
  } else if(props.defaultVisible === "all") {
    treeRef.value.setCheckedKeys(["0"]);
  } else {
    treeRef.value.setCheckedKeys(props.defaultVisible);
  }
})

const treeToIndices = (trees) => {
  let indicesObj = {};
  for(let node of trees ) {
    const { id, children=[], ...prop } = node;
    id && (indicesObj[id] = prop);
    if(children.length) {
      Object.assign(indicesObj, treeToIndices(children))
    }
  }
  return indicesObj;
}




</script>

<style lang="scss" scoped>
.bs-atlas {
  &-tooltip {
    position: absolute;
    right: 20px;
    top: 50px;
    z-index: 99;
    width: 240px;
    &-close-btn {
      position: absolute;
      right: 10px;
      cursor: pointer;
      z-index: 199;
    }
  }

  &-visualize{
    min-height: 100vh;
    .label {
      margin-top: 100px;
      padding-left: 20px;
      .atlas-title {
        color: #fff;
      }
      .tree-scroll {
        height: 80%;
      }
    }
    .neuro {
      margin: 20px 20px 0;
      height: 95vh;
      :deep(.neuroglancer-panel:focus-within) {
        border:none;
      }
      :deep(.neuroglancer-layer-panel), :deep(.neuroglancer-viewer-top-row) {
        display: none !important;
      }
    }

  }
}
</style>