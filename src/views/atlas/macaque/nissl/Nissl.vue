<template>
<el-row class="nissl">
  <el-col :span="4">
    <h1 style="color: #fff">Nissl Data</h1>
    <el-scrollbar max-height="calc(100vh-150px)" class="thumbnail">
      <div 
        v-for="(nissl, index) in nisslList" 
        :key="nissl" 
        :class="['thumbnail-item', nissl === showNissl ? 'thumbnail-item-active':'']" 
        @click="handleShowNissl(nissl)"
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
  <el-col :span="16" class="p-l-16 p-r-16 neuroglancer">
    <vue-neuroglancer
      ref="neuroRef"
      :state="state"
      @focus-segment-changed="handleFocusRegion"
    />
  </el-col>
  <el-col :span="4" class="p-r-8">
    <div class="slice">
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
</template>
<script setup>
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import { onMounted, ref } from "vue";

import { treeToIndices } from "../../utils";
import LABEL_TREE from "../labelTree";
import BsAtlasRegionTooltip from "@/components/bsAtlas/BsAtlasRegionTooltip.vue";

const neuroRef = ref();
const nisslList = ['R04_A_P08_N13', 'R04_A_P12_N13', 'R04_A_P15_N13', 'R04_B_P24_N01', 'R04_B_P14_N01', 'R04_B_P12_N01', 'R04_B_P09_N13' ];
const nisslX= {
  'R04_A_P08_N13': 30,
 'R04_A_P12_N13': 36,
 'R04_A_P15_N13': 40,
 'R04_B_P24_N01': 74,
 'R04_B_P14_N01': 97,
 'R04_B_P12_N01': 102,
 'R04_B_P09_N13': 108
};
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


onMounted(() => {
  canvas_line = document.getElementById("slice");
  ctx_line = canvas_line.getContext("2d");
  fetch(`${baseUrl}/state.json`).then((response) => {
    return response.json();
  }).then(data => {
    handleShowNissl(nisslList[0], data);
  })
})

const drawSliceLine = (nissl) => {
  ctx_line.clearRect(0,0, 201, 148);
  const x = nisslX[nissl];
  ctx_line.strokeStyle = "#52c41a";
  ctx_line.lineWidth = 2;
  ctx_line.beginPath();
  ctx_line.moveTo(x, 0);
  ctx_line.lineTo(x, 148);
  ctx_line.stroke();
}

const handleShowNissl = (nissl, currState=state.value) => {
  drawSliceLine(nissl);
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
  const { layers } = state.value;
  const layerType = dataType === "image" ? dataType : "segmentation";
  layers.forEach(l => {
    if(layerType === l.type) {
      l.visible = visible
    }
  });
  state.value = {
    ...state.value,
    layers
  }
}

const handleMeshAlpha = (val) => {
  state.value.layers[3].selectedAlpha = val;
}

const handleFocusRegion = (regionId) => {
  if(!focusRegion.value || regionId !== focusRegion.value) {
    focusRegion.value = regionId;
    focusRegionInfo.value = labelIndices[regionId];
  }
}




</script>

<style lang="scss" scoped>
.nissl {
  height: 100vh;
  padding: 20px 8px;
  
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
    img, .slice-line {
      position:absolute;
      top: 0;
      left: 0;
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