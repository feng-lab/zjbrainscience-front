<template>
<el-row class="nissl">
  <el-col :span="4" class="p-t-20">
    <h1 style="color: #fff">BNA Macaque </h1>
    <el-scrollbar max-height="calc(100vh-150px)" class="thumbnail">
      <div 
        v-for="(nissl, index) in nisslList" 
        :key="nissl" 
        :class="['thumbnail-item', nissl === showNissl ? 'thumbnail-item-active':'']" 
        @click="handleShowNissl(nissl)"
        @mouseover="handleFocusNissl(nissl)"
        @mouseleave="handleLeaveNissl"
      >
        <div class="thumbnail-item-title"> 
          <span class="thumbnail-item-title-seq">{{ `${index+1}/${nisslList.length}` }}</span>
          <span class="thumbnail-item-title-name m-l-8 ">{{ nissl }} </span>
        </div>
        <div class="thumbnail-item-img">
          <img :src="`${thumbnailUrl}/${nissl}.png`"/>
        </div>
      </div>
    </el-scrollbar>
  </el-col>
  <el-col :span="20">
    <atlas-header
      :sub-page="SUB_PAGE" 
      :layout-change="false"
      :atlas-props="{name: 'macaque_bna'}"
    />
    <el-row class="neuro">
      <el-col :span="20" class="p-l-16 p-r-16 neuroglancer">
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
          @focus-segment-changed="handleFocusRegion"
        />
      </el-col>
      <el-col :span="4">
        <div class="slice atlas-widget">
          <img :src="`${baseUrl}/slice_sagittal.png`"/>
          <canvas id="slice" width="201" height="148" class="slice-line"/>
        </div>
        <div class="atlas-widget nissl-setting">
          <p class="nissl-setting-label">Render Datas</p>
          <div class="nissl-setting-item">
            <span>Brain Region</span>
            <el-switch v-model="showRegion" @change="val=>handleLayerVisible('region', val)"/>
          </div>
          <div class="nissl-setting-item">
            <span>Nissl Slice Image</span>
            <el-switch v-model="showImage" @change="val=>handleLayerVisible('image', val)"/>
          </div>
          <p class="nissl-setting-label">Render Setting</p>
          <div>
            <span>Brain Region Opacity</span>
            <el-slider 
              :min="0" 
              :max="1" 
              :step="0.1" 
              v-model="meshAlpha" 
              show-input
              :show-input-controls="false"
              input-size="small"
              @input="handleMeshAlpha"
            />
          </div>
        </div>
        <bs-atlas-region-tooltip
          v-if="focusRegion"
          :segment-id="focusRegion"
          :segment-info="focusRegionInfo"
        />
      </el-col>
    </el-row>
  </el-col>
</el-row>
</template>
<script setup>
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import { onMounted, ref } from "vue";

import { treeToIndices } from "../../utils";
import LABEL_TREE from "../labelTree";
import BsAtlasRegionTooltip from "@/components/bsAtlas/BsAtlasRegionTooltip.vue";
import AtlasHeader from "../../AtlasHeader.vue";
import SUB_PAGE from "../subpage";

const neuroRef = ref();
let nisslList = ref([]);
let sagittalInfo = {};
const baseUrl = `http://${window.location.host}/atlas_data/macaque_bna/macaque_bna_nissl`;
const thumbnailUrl = `${baseUrl}/thumbnail` 
const state = ref({});
const showNissl = ref();

const showRegion = ref(true);
const showImage = ref(true);
const meshAlpha = ref(0.5);

const labelIndices = treeToIndices(LABEL_TREE);

const focusRegion = ref();
const focusRegionInfo = ref({});

let canvas_line;
let ctx_line;

onMounted(async () => {
  canvas_line = document.getElementById("slice");
  ctx_line = canvas_line.getContext("2d");

  const sagittalR = await fetch(`${baseUrl}/sagittal.json`);
  sagittalInfo = await sagittalR.json();
  nisslList.value = Object.keys(sagittalInfo);

  fetch(`${baseUrl}/state.json`).then((response) => {
    return response.json();
  }).then(data => {
    handleShowNissl(nisslList.value[0], data);
  })
})

const drawSliceLine = (nissl, color) => {
  //ctx_line.clearRect(0,0, 201, 148);
  //canvas_line.width = 201;
  const x = sagittalInfo[nissl].sagittal_position;
  ctx_line.strokeStyle = color;
  ctx_line.lineWidth = 2;
  ctx_line.beginPath();
  ctx_line.moveTo(x, 0);
  ctx_line.lineTo(x, 148);
  ctx_line.stroke();
}

const handleShowNissl = (nissl, currState=state.value) => {
  clearCanvas();
  drawSliceLine(nissl, "#52c41a");
  showNissl.value = nissl;
  const { layers: originLayers } = currState;
  const layerUrl = `${baseUrl}/${nissl}`
  const layers = originLayers.map(l => {
    let source = `precomputed://${layerUrl}/region`;
    if(l.type === "image") {
      source = `precomputed://${layerUrl}/image/${nissl}_${l.name}`;
    }
    return {
      ...l,
      source
    }
  })
  state.value = {
    ...currState,
    layers
  }
}


const handleLayerVisible = (dataType, visible) => {
  const currentStateJ = neuroRef.value.getViewerState().toJSON();
  const { layers } = currentStateJ;
  const layerType = dataType === "image" ? dataType : "segmentation";
  layers.forEach(l => {
    if(layerType === l.type) {
      l.visible = visible
    }
  });
  state.value = {
    ...currentStateJ,
    layers
  }
}

const clearCanvas = () => {
  canvas_line.width = 201;
}

const handleMeshAlpha = (val) => {
  const currentStateJ = neuroRef.value.getViewerState().toJSON();
  const { layers } = currentStateJ;
  layers[3].selectedAlpha = val;
  state.value = {
    ...currentStateJ,
    layers
  }
}

const handleFocusRegion = (regionId) => {
  if(!focusRegion.value || regionId !== focusRegion.value) {
    focusRegion.value = regionId;
    focusRegionInfo.value = labelIndices[regionId];
  }
}

const handleFocusNissl = (nissl) => {
  if(nissl !== showNissl.value) {
    console.log('focus nissl', nissl)
    clearCanvas();
    drawSliceLine(showNissl.value, "#52c14a")
    drawSliceLine(nissl, "#1668dc")
  }
}

const handleLeaveNissl = () => {
  clearCanvas();
  drawSliceLine(showNissl.value, "#52c14a")
}




</script>

<style lang="scss" scoped>
.nissl {
  height: 100vh;
  padding: 0px 8px;

  .neuro {
    height: calc(100vh - 20px - 75px);
  }
  
  .thumbnail {
    margin-top: 32px;
    height: calc(100vh - 110px);
    &-item {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      border-bottom: 2px solid #1668dc;
      height: 120px;
      &-title {
        &-seq {
          color: #1668dc;
        }

        &-name {
          color: #fff;
        }
      }
      &-img {
        height: 80px;
        text-align: center;
        img {
          height: 100%;
        }
      }
      &-active {
        background: rgba(17, 26, 44, 0.9);
      }
    }
    .thumbnail-item:first-child {
      border-top: 2px solid #1668dc;
    }
    .thumbnail-item:hover {
      cursor: pointer;
      background: rgba(17, 26, 44, 0.7);
    }
  }

  .slice {
    position: relative;
    height: 180px;
    img, .slice-line {
      position:absolute;
      top: calc(50% - 74px);
      left: calc(50% - 105px);
    }
  }

  &-setting {
    padding: 16px 8px;
    position:absolute;
    bottom: 8px;
    left: 0px;
    right: 0px;
    &-label {
      color: #fff;
      margin-bottom: 8px;
      &::before {
        content: "";
        border-left: 5px solid #52c41a;
        margin-right: 8px;
      }
    }
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>