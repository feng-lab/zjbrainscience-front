<template>
  <div class="bs-atlas">
    <el-row class="bs-atlas-visualize" justify="space-between">
      <el-col :span="5" class="bs-atlas-visualize-left m-l-8">
        <div class="label">
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
            <el-scrollbar :max-height="500" class="tree-scroll">
              <el-tree
                ref="treeRef"
                :data="treeData"
                multiple
                node-key="id"
                show-checkbox
                @check="handleTreeValue"
                :filter-node-method="filterNode"
                :default-expanded-keys="['0']"
                class="atlas-widget-inner"
              />
            </el-scrollbar>
          </div>
        </div>
        <div class="bs-atlas-tooltip-box">
          <div class="atlas-widget bs-atlas-tooltip" v-if="selectedSegmentId">
            <h1>ID: {{ selectedSegmentId }}</h1>
            <div v-for="key in ['Acronym', 'Description', 'Lobe', 'Gyrus']" :key="key">
              <template v-if="selectedSegmentInfo[key]">
                <p class="icon-label"><bs-icon-img icon="Memo"/><strong>{{key}}</strong></p>
                <p class="description">{{selectedSegmentInfo[key]}}</p>
              </template>
            </div>
          </div>
          <div class="atlas-widget bs-atlas-tooltip" v-if="focusConnectivity?.id">
            <h1>Connectivity</h1>
            <p> 
              <span class="label">
                <span> {{ focusConnectivity.point1 }} </span>
                <bs-icon-img icon="Right" v-if="focusConnectivity.opposite"/>
                <bs-icon-img icon="Switch" v-else/>
                <span> {{ focusConnectivity.point2 }}: </span> 
              </span>
              <span class="m-l-8 red">{{Number(focusConnectivity.value).toExponential()}}</span>
            </p>
            <p v-if="focusConnectivity.opposite && !selectedMode"> 
              <span class="label">
                <span> {{ focusConnectivity.point2 }} </span>
                <bs-icon-img icon="Back" />
                <span>{{ focusConnectivity.point1 }}: </span>
              </span>
              <span class="m-l-8 red">{{Number(focusConnectivity.opposite).toExponential()}}</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="14" class="neuro" >
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
          :event-bindings="eventBindings"
          @focus-segment-changed="handleFocusSegmentChanged"
          @focus-annotation-changed="handleFocusAnnotationChanged"
          @toggle-segment="handleToggleSegment"
        />
      </el-col>
      <el-col :span="4" style="padding: 20px 8px 0px 0px">
        <bs-atlas-bdf ref="bdfRef" v-if="plugins?.bdf" v-bind="bdfData" class="m-b-8"/>
        <bs-atlas-pcf ref="pcfRef" v-if="plugins?.pcf" v-bind="pcfData" class="m-b-8"/>
        <bs-atlas-setting 
          :layers="Object.values(renderLayers)"
          :plugins="plugins"
          @change-layer-visible="handleLayerVisibleChanged"
          @change-mesh-alpha="setMeshLayerAlpha"
          @change-normalize="setNormalizedRange"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";

import { nextTick, onMounted, ref, watch, computed } from "vue";
import BsIconImg from "../BsIconImg.vue";
import BsAtlasBdf from "./BsAtlasBdf.vue";
import { segmentProps, useSegmentLayer } from "@/compositions/atlas/useSegmentLayer";
import { useWholeBrainLayer, wholeBrainProps } from "@/compositions/atlas/useWholeBrainLayer";
import { useAtlas } from "@/compositions/atlas/useAtlas";
import { useBigBrainLayer } from "@/compositions/atlas/useBigBrainLayer";
import { connectivityProps, useConnectivityLayer } from "@/compositions/atlas/useConnectivityLayer";

const { 
  neuroRef, 
  renderLayers, 
  addLayer, 
  state,
  setLayerVisible
} = useAtlas();


const props = defineProps({
  name: {
    type: String,
    required: true
  },
  atlasState: {
    type: Object,
    default: {},
    required: true
  },
  title: String,
  site: String,
  plugins: Object,
  pcfData: Object,
  bdfData: Object,
  ...segmentProps,    
  ...wholeBrainProps,
  ...connectivityProps
})

const baseUrl = `http://${window.location.host}/atlas_data/${props.name}`;

const { 
  treeRef, 
  segmentationLayer, 
  layer:segmentLayer, 
  layerSetting:segmentLayerSetting,
  setMeshLayerAlpha
} = useSegmentLayer(neuroRef, baseUrl, props);


//const treeRef = ref();
const selectedSegmentId = ref();
const selectedSegmentInfo = ref({});
const filterText = ref("");
let labelIndices = {};
const bdfRef = ref();
const pcfRef = ref();
const focusConnectivity = ref();
const showWhitchSide = ref("all");

const showConnectivity = ref(false);
const showWholeBrain = ref(true);
let segmentsLayer = null;
const selectedMode = ref(false);

const segmentsLayerName = `${props.name}_segments`;
const wholeLayerName = `${props.name}_whole`;
const connectivity = `${props.name}_connectivity`;
const connectivityEdgesLayerName = `${connectivity}_edges`;
const connectivityEndpointsLayerName = `${connectivity}_endpoints`;

//const layers = [segmentLayerSetting];
const { setNormalizedRange } = useBigBrainLayer(neuroRef, baseUrl, props);


if(props.plugins?.bigBrain) {
  const { layer: bigBrainLayer, layerSetting: bigBrainLayerSetting, setNormalizedRange } = useBigBrainLayer(neuroRef, baseUrl, props);
  addLayer(bigBrainLayer, bigBrainLayerSetting);
}

addLayer(segmentLayer, segmentLayerSetting);

if(props.wholeSegmentId) {
  const { layer: wholeBrainLayer, layerSetting: wholeBrainLayerSetting } = useWholeBrainLayer(baseUrl, props);
  addLayer(wholeBrainLayer, wholeBrainLayerSetting);
}
if(props.plugins?.connectivity) {
  const { layer: connectivityLayer, layerSetting: connectivityLayerSetting } = useConnectivityLayer(baseUrl, props, segmentLayerSetting.key);
  addLayer(connectivityLayer, connectivityLayerSetting);
}

state.value = {
  ...state.value,
  ...props.atlasState
}


onMounted(() => {
  labelIndices = treeToIndices(props.treeData);
  if(props.defaultVisible === "all") {
    treeRef.value.setCheckedKeys(["0"]);
  } else if(props.defaultVisible.length){
    treeRef.value.setCheckedKeys(props.defaultVisible);
  }
})

const handleClickEndpoints = (point) => {
  const { annotationId=null } = point;
  if(annotationId) {
    const sid = props.connectivityEndpoints[annotationId];
    treeRef.value.setCheckedKeys([sid], true);
    neuroRef.value.setVisibleSegments(segmentsLayerName, [sid]);
    handleClickSegments(sid);
  }
}

const handleClickEdges = (edge) => {
  const { annotationId=null } = edge;
  if(annotationId) {
    const edgeInfo = props.connectivityEdges[annotationId];
    console.log(edgeInfo);
  }
}

const handleClickSegments = (segment) => {
  selectedMode.value = true;
  let key = segment;
  if(typeof(key) === "object") {
     key = segment?.value?.key;
  }
  const info = labelIndices[key];
  props.plugins?.bdf && bdfRef.value.handleSelect(key, info?.Acronym);
  props.plugins?.pcf && pcfRef.value.handleSelect(key, info?.Acronym);
}


const handleLayerVisibleChanged = (layer, isRender) => {
  let layers = layer.layers;
  if(layer.key.endsWith("_connectivity")) {
    segmentationLayer.value.layer.displayState.silhouetteRendering.value = Number(!!isRender);
    if(typeof isRender === "string") {
      setLayerVisible(layers, false);
      layers = layers.filter(l => l.endsWith(`_${isRender}`))
    }
  } 
  setLayerVisible(layers, isRender)
}


const clickEventsHandler = {
  "endpoints": handleClickEndpoints,
  "edges": handleClickEdges,
  "segments": handleClickSegments
}

const eventBindings = [{
    name: "selectValues",
    event: "click",
    callback: () => {
      console.log('click')
      const selectedValues = neuroRef.value.getLayerSelectedValues();
      for(let [key, value] of Object.entries(selectedValues)) {
        const type = key.split("_").pop();
        const handler = clickEventsHandler[type];
        if(handler) {
          handler(value);
        }
      }
    }
}]




const handleTreeValue = () => {
  const ids = treeRef.value.getCheckedNodes(false, false)
                          .filter(node => Number(node.id))
                          .map(node => node.id);
  neuroRef.value.setVisibleSegments(segmentsLayerName, ids);
}

const handleFocusSegmentChanged = (segmentId, layer) => {
  if(segmentsLayerName === layer.name) {
    focusSegmentById(segmentId);
  }
}

const handleFocusAnnotationChanged = (id, layer) => {
  const annotationType = layer.name.split("_").pop();
  if(annotationType === "endpoints") {
    focusSegmentById(props.connectivityEndpoints[id]);
  } else {
    focusConnectivity.value = props.connectivityEdges[id];
  }
}

const focusSegmentById = (id) => {
  selectedSegmentId.value = id;
  selectedSegmentInfo.value = labelIndices[id] ?? {};
}

const handleVisibleSegmentsChanged = (segments, layer) => {
  if(segmentsLayerName === layer.name) {
    selectedMode.value = !!segments.length;
    treeRef.value.setCheckedKeys(segments);
  }
}

const handleToggleSegment = (segment, layer) => {
  if(segmentsLayerName === layer.name) {
    treeRef.value.setChecked(segment, false);
  }
}


const filterNode = (value, data) => {
  if(!value) return true;
  return data.label?.includes(value) || String(data.id).includes(value);
}

watch(filterText, (value) => {
  treeRef.value.filter(value);
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
  height: 100%;
  &-tooltip-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &-tooltip {
    h1 {
      color: #fff;
      &::before {
        content: "";
        border-left: 5px solid #52c41a;
        margin-right: 8px;
      }
    }
    .description{
      color: #fff;
    }
    background-color: rgba(17, 26, 44, 0.7) !important;
    &-close-btn {
      position: absolute;
      right: 10px;
      cursor: pointer;
      z-index: 199;
    }

    .label {
      width: 180px;
      display: inline-flex;
      flex-direction: row;
      justify-items: center;
      align-items: center;
      >* {
        flex: 0.3;
      }
      .direct-icon {
        transform: rotate(90deg);
      }
    }
  }

  &-visualize{
    min-height: 100vh;
    .label {
      margin-top: 20px;
      //padding-left: 20px;
      .atlas-title {
        color: #fff;
      }
      .tree-scroll {
        height: 80%;
        --el-fill-color-light: #000;
      }
    }
    &-left {
      display: flex;
      flex-direction: column;
      gap: 8px;
      >* {
        flex:1;
      }
    }
    .neuro {
      margin: 20px 20px 0;
      height: 92vh;
      :deep(.neuroglancer-panel:focus-within) {
        border:none;
      }
      :deep(.neuroglancer-layer-panel), :deep(.neuroglancer-viewer-top-row) {
        display: none !important;
      }

      .tool-box {
        display: flex;
        flex-direction: row-reverse;
        &-item {
          margin-left: 16px;
          &-label {
            color: white;
            margin-right: 8px;
          }
        }
      }
    }

  }
}

.red {
  color: #d32029;
  font-weight: bold;
}
</style>