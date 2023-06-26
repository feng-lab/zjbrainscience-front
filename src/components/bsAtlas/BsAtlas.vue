<template>
  <div class="bs-atlas">
    <div class="atlas-widget bs-atlas-tooltip" v-if="selectedSegmentId">
      <h1>ID: {{ selectedSegmentId }}</h1>
      <div v-for="key in ['Acronym', 'Description', 'Lobe', 'Gyrus']" :key="key">
        <template v-if="selectedSegmentInfo[key]">
          <p class="icon-label"><bs-icon-img icon="Memo"/><strong>{{key}}</strong></p>
          <p>{{selectedSegmentInfo[key]}}</p>
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
    <bs-atlas-bdf ref="bdfRef" v-if="plugins?.bdf" v-bind="bdfData"/>
    <bs-atlas-pcf ref="pcfRef" v-if="plugins?.pcf" v-bind="pcfData"/>
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
      </el-col>
      <el-col :span="17" class="neuro" >
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
          :event-bindings="eventBindings"
          @focus-segment-changed="handleFocusSegmentChanged"
          @focus-annotation-changed="handleFocusAnnotationChanged"
          @toggle-segment="handleToggleSegment"
        />
        <div class="tool-box">
          <div class="tool-box-item" v-if="plugins?.connectivity">
            <span class="tool-box-item-label">Connectivity</span>
            <el-select v-if="plugins?.connectivity === 'lr'" @change="handleChangeShowSide" v-model="showWhitchSide">
              <el-option value="all" label="All"/>
              <el-option value="none" label="None"/>
              <el-option value="left" label="Left"/>
              <el-option value="right" label="Right"/>
            </el-select>
            <el-switch v-model="showConnectivity" @change="handleShowConnectivity" v-else/>
          </div>
          <div class="tool-box-item">
            <span class="tool-box-item-label">Whole Brain</span>
            <el-switch v-model="showWholeBrain" @change="handleShowWholeBrain"></el-switch>
          </div>
        </div>
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

const props = defineProps({
  treeData: {
    type:Array,
    default: [],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  segmentsColors: Object,
  wholeSegmentId: String,
  baseUrl: String,
  atlasState: {
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
  },
  plugins: Object,
  pcfData: Object,
  bdfData: Object,
  connectivityEdges: Object,
  connectivityEndpoints: Object,
})

const treeRef = ref();
const neuroRef = ref();
const selectedSegmentId = ref();
const selectedSegmentInfo = ref({});
const filterText = ref("");
let labelIndices = {};
const bdfRef = ref();
const pcfRef = ref();
const focusConnectivity = ref();
const showWhitchSide = ref("all");

const showConnectivity = ref(props?.plugins?.connectivity);
const showWholeBrain = ref(true);
let segmentsLayer = null;
const selectedMode = ref(false);

const baseUrl = `http://${window.location.host}/atlas_data/${props.name}`;
const segmentsLayerName = `${props.name}_segments`;
const wholeLayerName = `${props.name}_whole`;
const connectivity = `${props.name}_connectivity`;
const connectivityEdgesLayerName = `${connectivity}_edges`;
const connectivityEndpointsLayerName = `${connectivity}_endpoints`;

const state = ref({
  "showAxisLines": true,
  "showScaleBar": false,
  "showDefaultAnnotations": false,
  "showSlices": false,
  "layout": "3d",
  "crossSectionBackgroundColor": "#262626",
  "layers" : [{
    "type": "segmentation", 
    "source": `precomputed://${baseUrl}/${segmentsLayerName}`, 
    "tab": "segments", 
    "meshSilhouetteRendering": showConnectivity.value ? 1 : 0,
    "name": segmentsLayerName,
    "segmentColors": props.segmentsColors
  }],
  ...props.atlasState
})
if(props.wholeSegmentId) {
  state.value.layers = [
    ...state.value.layers,
    {
      "type": "segmentation", 
      "source": `precomputed://${baseUrl}/${wholeLayerName}`, 
      "tab": "segments", 
      "name": wholeLayerName,
      "disableResponseDblclick0Event": true,
      "segments": [props.wholeSegmentId],
      "meshSilhouetteRendering": 5,
      "segmentDefaultColor": "#ffffff",
    }

  ]

}
if(props.plugins?.connectivity) {
  if(props.plugins.connectivity === 'lr') {
    ["left", "right"].forEach(x => {
      state.value.layers = [
        ...state.value.layers,
      {
        "type": "annotation",
        "source": `precomputed://${baseUrl}/${connectivity}/${x}/edges`, 
        "tab": "annotations",
        "linkedSegmentationLayer": {
          "segment": segmentsLayerName
        },
        "filterBySegmentation": [ "segment" ],
        "name": `${x}_${connectivityEdgesLayerName}`,
        "shader": "\nvoid main() {\n  setColor(defaultColor());\n  setEndpointMarkerSize(0.0);\n}\n",
      },
      {
        "type": "annotation",
        "source": `precomputed://${baseUrl}/${connectivity}/${x}/endpoints`,
        "tab": "annotations",
        "linkedSegmentationLayer": {
          "segment": segmentsLayerName
        },
        "filterBySegmentation": [ "segment" ],
        "name": `${x}_${connectivityEndpointsLayerName}`
      }
      ]
    })

  } else {
    state.value.layers = [
      ...state.value.layers,
    {
      "type": "annotation",
      "source": `precomputed://${baseUrl}/${connectivity}/edges`, 
      "tab": "annotations",
      "linkedSegmentationLayer": {
        "segment": segmentsLayerName
      },
      "filterBySegmentation": [ "segment" ],
      "name": connectivityEdgesLayerName,
      "shader": "\nvoid main() {\n  setColor(defaultColor());\n  setEndpointMarkerSize(0.0);\n}\n",
    },
    {
      "type": "annotation",
      "source": `precomputed://${baseUrl}/${connectivity}/endpoints`,
      "tab": "annotations",
      "linkedSegmentationLayer": {
        "segment": segmentsLayerName
      },
      "filterBySegmentation": [ "segment" ],
      "name": connectivityEndpointsLayerName
    }
    ]
  }
}

onMounted(() => {
  labelIndices = treeToIndices(props.treeData);
  if(props.defaultVisible === "all") {
    treeRef.value.setCheckedKeys(["0"]);
  } else if(props.defaultVisible.length){
    treeRef.value.setCheckedKeys(props.defaultVisible);
  }
  segmentsLayer = neuroRef.value.getManagedLayer(segmentsLayerName);
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

const handleShowConnectivity = (value) => {
  const endpointsLayer = neuroRef.value.getManagedLayer(connectivityEndpointsLayerName);
  endpointsLayer.setVisible(value);
  const edgesLayer = neuroRef.value.getManagedLayer(connectivityEdgesLayerName);
  edgesLayer.setVisible(value);
  const { meshSilhouetteRendering } = state.value.layers[0];
  if(value) {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 1
  } else {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 0
  }
}

const setLayerVisible = (layerName, visible) => {
  const layer = neuroRef.value.getManagedLayer(layerName);
  layer.setVisible(visible);
} 

const handleChangeShowSide = (value) => {
  if(value === 'left') {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 1
    setLayerVisible(`left_${connectivityEdgesLayerName}`, true);
    setLayerVisible(`left_${connectivityEndpointsLayerName}`, true);
    setLayerVisible(`right_${connectivityEdgesLayerName}`, false);
    setLayerVisible(`right_${connectivityEndpointsLayerName}`, false);
  } else if(value === 'right') {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 1
    setLayerVisible(`left_${connectivityEdgesLayerName}`, false);
    setLayerVisible(`left_${connectivityEndpointsLayerName}`, false);
    setLayerVisible(`right_${connectivityEdgesLayerName}`, true);
    setLayerVisible(`right_${connectivityEndpointsLayerName}`, true);
  } else if(value === 'all') {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 1
    setLayerVisible(`left_${connectivityEdgesLayerName}`, true);
    setLayerVisible(`left_${connectivityEndpointsLayerName}`, true);
    setLayerVisible(`right_${connectivityEdgesLayerName}`, true);
    setLayerVisible(`right_${connectivityEndpointsLayerName}`, true);
  } else if(value === 'none') {
    segmentsLayer.layer.displayState.silhouetteRendering.value = 0
    setLayerVisible(`left_${connectivityEdgesLayerName}`, false);
    setLayerVisible(`left_${connectivityEndpointsLayerName}`, false);
    setLayerVisible(`right_${connectivityEdgesLayerName}`, false);
    setLayerVisible(`right_${connectivityEndpointsLayerName}`, false);
  }
}

const handleShowWholeBrain = (value) => {
  neuroRef.value.getManagedLayer(wholeLayerName).setVisible(value);
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
  const start = new Date().getTime();
  const ids = treeRef.value.getCheckedNodes(false, false)
                          .filter(node => Number(node.id))
                          .map(node => node.id);
  const middle = new Date().getTime();
  console.log('get checked value cost:', middle - start);
  neuroRef.value.setVisibleSegments(segmentsLayerName, ids);
  const end = new Date().getTime();
  console.log('render checked value cost:', end - middle);
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
  &-tooltip {
    position: absolute;
    right: 20px;
    top: 50px;
    z-index: 99;
    width: 320px;
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
    min-height: 98vh;
      .label {
        margin-top: 20px;
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