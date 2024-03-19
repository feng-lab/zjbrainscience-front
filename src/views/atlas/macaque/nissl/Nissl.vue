<template>
  <atlas-base 
    :atlas-id="atlasId"
    :header-setting="{
      layoutChange: false,
      renderDataSetting: false,
      renderCtrlSetting: false
    }"
    :sub-page="SUB_PAGE"
    :right-custom="true"
  >
    <template #left>
    <el-scrollbar max-height="calc(100vh-150px)" class="thumbnail">
      <div 
        v-for="(nissl, index) in nisslList" 
        :key="nissl" 
        :class="['thumbnail-item', {'thumbnail-item-active': nissl === showNissl}]" 
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
    </template>

    <template #neuro> 
      <vue-neuroglancer
        ref="neuroRef"
        :state="state"
        @focus-segment-changed="handleFocusRegion"
      />
    </template>
    <template #right>
      <div class="right-panel">
        <div class="sagittal">
          <img :src="`${baseUrl}/slice_sagittal.png`"/>
          <canvas id="slice" width="355" height="225" class="slice-line"/>
        </div>
        <bs-widgets header="Render Setting">
          <div class="m-b-8">
            <span class="item-label">Brain Region Opacity</span>
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
        </bs-widgets>
        <bs-widgets header="Render Datas">
          <div class="between-flex">
            <span class="item-label">Brain Region</span>
            <el-switch v-model="showRegion" @change="val=>handleLayerVisible('region', val)"/>
          </div>
          <div class="between-flex">
            <span class="item-label">Slice Image</span>
            <el-switch v-model="showImage" @change="val=>handleLayerVisible('image', val)"/>
          </div>
        </bs-widgets>
        <bs-region-tooltip
          v-if="focusRegion?.region_id"
          :focus-region="focusRegion"
        />
      </div>
    </template>
  </atlas-base>
</template>
<script setup>

import axios from "axios";
import AtlasBase from "../../AtlasBase.vue"
import { onMounted, ref } from "vue";
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import SUB_PAGE from "../subpage";
import { storeToRefs } from "pinia";
import useAtlasStore from '@/stores/atlas';
import BsRegionTooltip from "@/components/bsAtlas/BsRegionTooltip.vue";
import BsWidgets from "@/components/bsAtlas/BsWidgets.vue";

const neuroRef = ref();
const nisslList = ref([]);
let sagittalInfo = {}
const baseUrl = `http://${window.location.host}/atlas_data/macaque_bna/macaque_bna_nissl`;
const thumbnailUrl = `${baseUrl}/thumbnail` 

const showNissl = ref();
const atlasId = 2;

const state = ref({});

const showRegion = ref(true);
const showImage = ref(true);
const meshAlpha = ref(0.5);

let canvas_line;
let ctx_line;

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

const handleFocusNissl = (nissl) => {
  if(nissl !== showNissl.value) {
    clearCanvas();
    drawSliceLine(showNissl.value, "#52c14a")
    drawSliceLine(nissl, "#1668dc")
  }
}

const drawSliceLine = (nissl, color) => {
  const x = sagittalInfo[nissl].sagittal_position;
  ctx_line.strokeStyle = color;
  ctx_line.lineWidth = 2;
  ctx_line.beginPath();
  ctx_line.moveTo(x, 0);
  ctx_line.lineTo(x, 225);
  ctx_line.stroke();
}

const handleLeaveNissl = () => {
  clearCanvas();
  drawSliceLine(showNissl.value, "#52c14a")
}


const clearCanvas = () => {
  canvas_line.width = 355;
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

const handleFocusRegion = async (regionId) => {
  const { getFocusRegion } = useAtlasStore();
  await getFocusRegion(regionId, atlasId);
}

const { focusRegion } = storeToRefs(useAtlasStore());

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




onMounted(async () => {

  canvas_line = document.getElementById("slice");
  ctx_line = canvas_line.getContext("2d");
  const sagittalR = await fetch(`${baseUrl}/sagittal.json`);
  sagittalInfo = await sagittalR.json();
  nisslList.value = Object.keys(sagittalInfo);

  const { data: initState } = await axios.get(`${baseUrl}/state.json`);
  console.log('initState', initState)
  handleShowNissl(nisslList.value[0], initState);
})


</script>

<style lang="scss" scoped>
.sagittal {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 99;
  height: 225px;
  width: 355px;
  border: 1px solid var(--bs-border-color);
  background: #000;
  border-radius: 8px;
  img, .slice-line {
    position:absolute;
    top: calc(50% - 112px);
    left: calc(50% - 177px);
  }
}

.thumbnail {
    margin-top: 32px;
    height: calc(100vh - 110px);
    &-item {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
      border-bottom: 2px solid var(--bs-border-color);
      height: 120px;
      &-title {
        &-seq {
          color: #1668dc;
          font-weight: 800;
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
        background: #1f1f1f;
        border-bottom: 2px solid var(--el-color-primary);
      }
    }
    .thumbnail-item:hover {
      cursor: pointer;
      background: #1f1f1f;
    }
  }

//.tooltip {
//  position: absolute;
//  width: 17%;
//  bottom: 0px;
//  right: 0px;
//}

.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  > * {
    overflow: hidden;
  }
}
</style>