<template>
<el-row class="tracer">
  <el-col :span="4">
    <h1 style="color: #fff">Tracer Data</h1>
    <div class="atlas-widget atlas-info m-t-24">
      <h2>Select Injection Source</h2>
      <el-radio-group v-model="showRegion" class="select-radio-group">
        <el-radio 
          class="select-radio-item"
          v-for="region in regionList" 
          :key="region" 
          :label="region"
          size="large"
        />
      </el-radio-group>
    </div>
    <div class="atlas-widget atlas-info m-t-8" v-if="showInjection">
      <h2>Injection Position</h2>
      <p class="atlas-info-item">
        <strong>Region</strong>
        <span class="atlas-info-item-val red">{{ showRegion}}</span>
      </p>
      <p class="atlas-info-item" v-for="(dim, index) in ['X', 'Y', 'Z']" :key="dim">
        <strong>{{`Position-${dim}`}}</strong>
        <span class="atlas-info-item-val">{{ injections[showRegion][index] }}</span>
      </p>
    </div>
  </el-col>
  <el-col :span="16" class="p-l-16 p-r-16 neuroglancer">
    <vue-neuroglancer
      ref="neuroRef"
      :state="state"
      @focus-segment-changed="handleFocusRegion"
      @focus-annotation-changed="handleFocusCellCnt"
    />
  </el-col>
  <el-col :span="4" class="p-r-8">
    <div class="atlas-widget atlas-info m-t-8" v-if="focusCellCnt">
      <h2>Cell Count</h2>
      <p class="atlas-info-item">
        <strong>Count</strong>
        <span class="atlas-info-item-val red">{{ focusCellCntInfo.cellCnt }}</span>
      </p>
      <p class="atlas-info-item" v-for="(dim, index) in ['X', 'Y', 'Z']" :key="dim">
        <strong>{{ `Position-${dim}` }}</strong>
        <span class="atlas-info-item-val">{{ focusCellCntInfo?.position[index]}}</span>
      </p>
      <p class="atlas-info-item">
        <strong>Region ID</strong>
        <span class="atlas-info-item-val">{{ focusCellCntInfo.regionId}}</span>
      </p>
      <p class="atlas-info-item">
        <strong>Region Name</strong>
        <span class="atlas-info-item-val">{{ focusCellCntInfo.region}}</span>
      </p>
    </div>
    <bs-atlas-region-tooltip
      class="m-t-8"
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
import { ref, watch } from "vue";
import { treeToIndices } from "../../utils";
import LABEL_TREE from "../labelTree";
import BsAtlasRegionTooltip from "@/components/bsAtlas/BsAtlasRegionTooltip.vue";

const baseUrl = `http://${window.location.host}/atlas_data/macaque_bna`;
const surfaceUrl = `${baseUrl}/macaque_bna_flat_surface`;
const cellCntUrl = `${baseUrl}/macaque_bna_tracer`;

const neuroRef = ref();

const regionList = ["IFG.cd", "IFG.cv", "SFG.ri"]
const showRegion = ref(regionList[0]);
const showInjection = ref(false);


const state = ref({});

const labelIndices = treeToIndices(LABEL_TREE);

const focusRegion = ref();
const focusRegionInfo = ref({});

const focusCellCnt = ref();
const focusCellCntInfo = ref();

let cellCntIndices = {};

const injections = {
  "IFG.cd": [-24.060242, 6.199698,  0],
  "SFG.ri": [-26.752666, 12.493889, 0], 
  "IFG.cv": [-10.889385, 13.355932, 0]
}


const initState = async () => {
  const res = await fetch(`${cellCntUrl}/state.json`);
  const data = await res.json();
  return data;
}

const fetchCellCntIndices = (region) => {
  fetch(`${cellCntUrl}/${region}/cellCntInfo.json`).then(response => {
    return response.json();
  }).then(data => {
    cellCntIndices = data;
  })
}

const handleFocusRegion = (regionId) => {
  if(regionId === "125") return;
  if(!focusRegion.value || regionId !== focusRegion.value) {
    focusRegion.value = regionId;
    focusRegionInfo.value = labelIndices[regionId];
  }
}
const handleFocusCellCnt = (cell, layer) => {
  if(layer.name === "injection") {
    showInjection.value = !!cell;
  } else {
    focusCellCnt.value = cell;
    focusCellCntInfo.value = cellCntIndices[cell];
  }
}

watch(showRegion, async (region) => {
  let currState;
  if(JSON.stringify(state.value) === '{}') {
    currState = await initState();
  } else {
    currState = neuroRef.value.getViewerState().toJSON();
  }
  if(region) {
    const { layers } = currState;
    const [surfaceLayer, cellLayer, injectionLayer] = layers;
    surfaceLayer.source.url = `precomputed://${surfaceUrl}`;
    cellLayer.source = `precomputed://${cellCntUrl}/${region}`;
    injectionLayer.annotations[0].base = injections[region];
    state.value = {
      ...currState,
      layers: [surfaceLayer, cellLayer, injectionLayer]
    };
    fetchCellCntIndices(region);
  }
}, {
  immediate: true
})

</script>

<style lang="scss" scoped>
.tracer {
  height: 98vh;
  padding: 20px 8px;
}

.select-radio-group {
  flex-direction: column;
}
.select-radio-item {
  margin-right:32px !important;
  color: #fff;
}

</style>