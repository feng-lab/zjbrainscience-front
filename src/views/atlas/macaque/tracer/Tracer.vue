<template>
  <atlas-base
    :atlas-id="atlasId"
    :sub-page="SUB_PAGE"
    :header-setting="{
      layoutChange: false,
      renderDataSetting: false,
      renderCtrlSetting: false
    }"
  > 
    <template #left> 
      <bs-widgets header="Injection Source">
        <el-radio-group 
          v-model="showRegion" 
          class="select-radio-group" 
          @change="handleInjectionSrcChanged"
        >
          <el-radio 
            class="select-radio-item"
            v-for="region in regionList" 
            :key="region" 
            :label="region"
            size="large"
          />
        </el-radio-group>
      </bs-widgets>
      <bs-widgets header="Injection Position" v-if="showInjection">
        <div class="between-flex">
          <strong class="item-label">Region</strong>
          <span class="red">{{ showRegion}}</span>
        </div>
        <div class="between-flex" v-for="(dim, index) in ['X', 'Y', 'Z']" :key="dim">
          <strong class="item-label">{{`Position-${dim}`}}</strong>
          <span>{{ injections[showRegion][index] }}</span>
        </div>
      </bs-widgets>

    </template>
    <template #neuro> 
      <vue-neuroglancer
        ref="neuroRef"
        :state="state"
        @focus-segment-changed="handleFocusRegion"
        @focus-annotation-changed="handleFocusCellCnt"
      />
      <div class="tooltip-box"> 
        <bs-region-tooltip
          v-if="focusRegion?.region_id"
          :focus-region="focusRegion"
        />
        <bs-widgets header="Cell Count" v-if="focusCellCntInfo?.cellCnt"> 
          <div class="between-flex">
            <strong class="item-label">Count</strong>
            <span class="red">{{ focusCellCntInfo.cellCnt }}</span>
          </div>
          <div class="between-flex" v-for="(dim, index) in ['X', 'Y', 'Z']" :key="dim">
            <strong class="item-label">{{ `Position-${dim}` }}</strong>
            <span>{{ focusCellCntInfo?.position[index]}}</span>
          </div>
          <div class="between-flex">
            <strong class="item-label">Region ID</strong>
            <span >{{ focusCellCntInfo.regionId}}</span>
          </div>
          <div class="between-flex">
            <strong class="item-label">Region Name</strong>
            <span>{{ focusCellCntInfo.region}}</span>
          </div>

        </bs-widgets>


      </div>
    </template>
  </atlas-base>
  
</template>
<script setup>
import AtlasBase from '../../AtlasBase.vue';

import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import SUB_PAGE from "../subpage";
import BsWidgets from '@/components/bsAtlas/BsWidgets.vue';

import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import useAtlasStore from '@/stores/atlas';
import BsRegionTooltip from '@/components/bsAtlas/BsRegionTooltip.vue';
import axios from 'axios';

const atlasId = 2;

const neuroRef = ref();
const baseUrl = `http://${window.location.host}/atlas_data/macaque_bna`;
const surfaceUrl = `${baseUrl}/macaque_bna_flat_surface`;
const cellCntUrl = `${baseUrl}/macaque_bna_tracer`;

const regionList = ref([]);
const showRegion = ref();
const showInjection = ref(false);

const focusCellCntInfo = ref();


let injections = {};


const { focusRegion } = storeToRefs(useAtlasStore());

const state = ref({});

let cellCntIndices = {};

const initState = async () => {
  const res = await fetch(`${cellCntUrl}/state.json`);
  const data = await res.json();
  return data;
}

const fetchCellCntIndices = async (region) => {
  const { data } = await axios.get(`${cellCntUrl}/${region}/cellCntInfo.json`);
  cellCntIndices = data;
}

const handleFocusCellCnt = (cell, layer) => {
  if(layer.name === "injection") {
    showInjection.value = !!cell;
  } else {
    focusCellCntInfo.value = cellCntIndices[cell];
  }
}

const handleFocusRegion = async (regionId) => {
  if(regionId === "125") return;
  const { getFocusRegion } = useAtlasStore();
  await getFocusRegion(regionId, atlasId);
}

const handleInjectionSrcChanged = async (source) => {
  console.log('injection source changed to ', source)
  if(source) {
    const currState = JSON.stringify(state.value) === "{}" ?  await initState() 
                       : neuroRef.value.getViewerState().toJSON();

    const { layers } = currState;
    const [surfaceLayer, cellLayer, injectionLayer] = layers;
    surfaceLayer.source.url = `precomputed://${surfaceUrl}`;
    cellLayer.source = `precomputed://${cellCntUrl}/${source}`;
    injectionLayer.annotations[0].base = injections[source];
    state.value = {
      ...currState,
      layers: [surfaceLayer, cellLayer, injectionLayer]
    };
    await fetchCellCntIndices(source);
  }
}

onMounted(async () => {
  const { data } = await axios.get(`${cellCntUrl}/injectionSource.json`);
  injections = data;
  regionList.value = Object.keys(injections);
  showRegion.value = regionList.value[0];
  await handleInjectionSrcChanged(showRegion.value)
})


</script>

<style lang="scss" scoped>
.select-radio-group {
  flex-direction: column;
}

.select-radio-item {
  margin-right:32px !important;
}

.tooltip-box {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 20%;

  @media only screen and (max-width: 1200px) {
    width: 30%;
  }
}
</style>