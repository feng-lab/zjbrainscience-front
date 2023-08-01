<template>
  <div class="bs-atlas">
    <el-row class="bs-atlas-visualize" justify="space-between">
      <el-col :span="4" class="bs-atlas-visualize-left m-l-8">
        <div class="label">
          <h1 class="atlas-title"> 
            {{ title }} 
            <p v-if="site">
              <el-link :href="site" target="_blank">{{ site }}</el-link>
            </p>
          </h1>
          <el-input 
            v-model="filterText" 
            placeholder="Search region by id or label" 
            clearable
            class="atlas-input m-b-8 m-t-16"
          />
          <div class="atlas-widget">
            <el-scrollbar 
              :max-height="!(plugins?.bdf||plugins?.pcf) && selectedSegmentId ? 230: 500" 
              class="tree-scroll"
            >
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
                :accordion="true"
              >
                <template #default="{node, data}">
                  <el-tooltip 
                    :content="`${node.label}, ID: ${data.id}`" 
                    placement="right" 
                    v-if="data.Acronym && data.id && node.label !== 'Whole Region'"
                  >
                    <span 
                      style="overflow: hidden; text-overflow: ellipsis"
                    >
                      {{ `${data.Acronym}(ID: ${data.id})` }}
                    </span>
                  </el-tooltip>
                  <el-tooltip 
                    v-else
                    :content="node.label"
                    placement="right"
                  >
                    {{ node.label }}
                  </el-tooltip>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="neuroColSpan" class="neuro" >
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
          :event-bindings="eventBindings"
          @focus-segment-changed="handleFocusSegmentChanged"
          @focus-annotation-changed="handleFocusAnnotationChanged"
          @toggle-segment="handleToggleSegment"
        />
        <div class="m-t-8" style="text-align: center" >
          <el-radio-group v-model="segmentsLayout">
            <el-radio-button label="4panel">
              <img style="height: 18px" :src="panel4"/>
            </el-radio-button>
            <el-radio-button label="3sliceT">
              <img style="height: 18px" :src="sliceT"/>
            </el-radio-button>
            <el-radio-button label="3sliceR">
              <img style="height: 18px" :src="sliceR"/>
            </el-radio-button>
            <el-radio-button label="3sliceB">
              <img style="height: 18px" :src="sliceB"/>
            </el-radio-button>
            <el-radio-button label="3sliceL">
              <img style="height: 18px" :src="sliceL"/>
            </el-radio-button>
            <el-radio-button label="xy-3d">
              <img style="height: 18px" :src="xy3d"/>
            </el-radio-button>
            <el-radio-button label="yz-3d">
              <img style="height: 18px" :src="xz3d"/>
            </el-radio-button>
            <el-radio-button label="xz-3d">
              <img style="height: 18px" :src="yz3d"/>
            </el-radio-button>
            <el-radio-button label="3d">
              3d<img style="height: 18px"/>
            </el-radio-button>
            <el-radio-button label="xy">
              xy<img style="height: 18px"/>
            </el-radio-button>
            <el-radio-button label="xz">
              xz<img style="height: 18px"/>
            </el-radio-button>
            <el-radio-button label="yz">
              yz<img style="height: 18px"/>
            </el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="4" style="padding: 20px 8px 0px 0px">
        <bs-atlas-bdf ref="bdfRef" v-if="showBDF" v-bind="plugins?.bdf?.bdfData" class="m-b-8"/>
        <bs-atlas-pcf ref="pcfRef" v-if="showPCF" v-bind="plugins?.pcf?.pcfData" class="m-b-8"/>
      </el-col>
    </el-row>
    <bs-atlas-setting 
      class="bs-atlas-setting"
      :layers="Object.values(renderLayers)"
      :plugins="plugins"
      @change-render-visible="handleRenderVisibleChanged"
      @change-mesh-alpha="setMeshLayerAlpha"
      @change-normalize="setNormalizedRange"
    />
    <bs-atlas-fc-and-sc ref="fcRef" v-if="showFC" v-bind="plugins?.fc?.fcData" type="FC" class="bs-atlas-fc"/>
    <bs-atlas-fc-and-sc ref="scRef" v-if="showSC" v-bind="plugins?.sc?.scData" type="SC" class="bs-atlas-sc"/>
    <div :class="[
        'bs-atlas-tooltip-box', 
        (plugins?.bdf || plugins?.pcf) ? 'bs-atlas-tooltip-box-right':'bs-atlas-tooltip-box-left']" 
    >
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
            <span> {{ focusConnectivity.point2 }} </span> 
          </span>
          <span class="m-l-8 red" v-if="focusConnectivity.value">{{Number(focusConnectivity.value).toExponential()}}</span>
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
import BsAtlasFcAndSc from "./BsAtlasFcAndSc.vue";
import panel4 from "@/assets/img/4panel.png";
import sliceT from "@/assets/img/3sliceT.png";
import sliceR from "@/assets/img/3sliceR.png";
import sliceB from "@/assets/img/3sliceB.png";
import sliceL from "@/assets/img/3sliceL.png";
import xy3d from "@/assets/img/xy3d.png";
import xz3d from "@/assets/img/xz3d.png";
import yz3d from "@/assets/img/yz3d.png";
import { useFcLayer } from "@/compositions/atlas/useFcLayer";
import { useScLayer } from "@/compositions/atlas/useScLayer";



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
  ...segmentProps,    
  ...wholeBrainProps,
  ...connectivityProps
})


const emits = defineEmits(["segmentSelected"]);

const baseUrl = `http://${window.location.host}/atlas_data/${props.name}`;

const { 
  neuroRef, 
  renderLayers, 
  addLayer, 
  state,
  setLayerVisible,
  segmentsLayout,
  segmentView,
  scfcView,
  showRegion
} = useAtlas(props);

const { 
  name: segmentLayerName,
  treeRef, 
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
const scRef = ref();
const fcRef = ref();
const focusConnectivity = ref();
const showWhitchSide = ref("all");

const showFC = ref(!!props?.plugins?.fc?.graph);
const showSC = ref(!!props?.plugins?.sc?.graph);
const showBDF = ref(!!props?.plugins?.bdf);
const showPCF = ref(!!props?.plugins?.pcf);

const neuroColSpan = computed(() => {
  const is15 = showBDF.value || showPCF.value;
  const colSpan = is15 ? 15 : 19;
  return colSpan
})

const otherDatasVisibleHandler = {
  fc: (val) => {
    showFC.value = val;
    if(showRegion.value?.id) {
      nextTick(() => {
        fcRef.value.handleSelect(showRegion.value.id, showRegion.value.acronym);
      })
    }
  },
  sc: (val) => {
    showSC.value = val
    if(showRegion.value?.id) {
      nextTick(() => {
        scRef.value.handleSelect(showRegion.value.id, showRegion.value.acronym);
      })
    }
  },
  bdf: (val) => {
    showBDF.value = val;
    if(showRegion.value?.id) {
      nextTick(() => {
        bdfRef.value.handleSelect(showRegion.value.id, showRegion.value.acronym);
      })
    }
  },
  pcf: (val) => {
    showPCF.value = val
    if(showRegion.value?.id) {
      nextTick(() => {
        pcfRef.value.handleSelect(showRegion.value.id, showRegion.value.acronym);
      })
    }
  }
}

let segmentsLayer = null;
const selectedMode = ref(false);

const segmentsLayerName = `${props.name}_segments`;
const connectivity = `${props.name}_connectivity`;

//const layers = [segmentLayerSetting];
const { setNormalizedRange } = useBigBrainLayer(neuroRef, baseUrl, props);


if(props.plugins?.bigBrain) {
  const { layer, layerSetting, setNormalizedRange } = useBigBrainLayer(neuroRef, baseUrl, props);
  addLayer(layer, layerSetting);
}

addLayer(segmentLayer, segmentLayerSetting);

if(props.wholeSegmentId) {
  const { layer, layerSetting } = useWholeBrainLayer(baseUrl, props);
  addLayer(layer, layerSetting);
}
if(props.plugins?.connectivity) {
  const { layer, layerSetting } = useConnectivityLayer(baseUrl, props, segmentLayerSetting.key);
  addLayer(layer, layerSetting);
}

if(props.plugins?.fc?.spatial) {
  const { layer, layerSetting } = useFcLayer(baseUrl, props)
  addLayer(layer, layerSetting)
}

if(props.plugins?.sc?.spatial) {
  const { layer, layerSetting } = useScLayer(baseUrl, props)
  addLayer(layer, layerSetting)
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
     key = segment?.value?.key ?? segment.value;
  }
  if(key && key !== "0") {
    const info = labelIndices[key];
    emits("segmentSelected", info)
    props.plugins?.bdf && bdfRef.value.handleSelect(key, info?.Acronym);
    props.plugins?.pcf && pcfRef.value.handleSelect(key, info?.Acronym);
    props.plugins?.fc?.graph && fcRef.value.handleSelect(key, info?.Acronym);
    props.plugins?.sc?.graph && scRef.value.handleSelect(key, info?.Acronym);
    if(props.plugins?.fc?.spatial) {
      neuroRef.value.setVisibleSegments(`${props.name}_fc`, [])
      neuroRef.value.setVisibleSegments(`${props.name}_fc`, [key])
    }
    if(props.plugins?.sc?.spatial) {
      neuroRef.value.setVisibleSegments(`${props.name}_sc`, [])
      neuroRef.value.setVisibleSegments(`${props.name}_sc`, [key])
    }
    showRegion.value = { id: key, acronym: info?.Acronym };
  }
}


const handleRenderVisibleChanged = (target, isRender) => {
  if(typeof(target) === "string") {
    const handler = otherDatasVisibleHandler[target];
    handler(isRender);
  } else {
    let layers = target.layers;
    if(target.key.endsWith("_connectivity")) {
      const segmentationLayer = neuroRef.value.getManagedLayer(segmentLayerName);
      segmentationLayer.layer.displayState.silhouetteRendering.value = Number(!!isRender);
      if(typeof isRender === "string") {
        setLayerVisible(layers, false);
        layers = layers.filter(l => l.endsWith(`_${isRender}`))
      }
    } 
    setLayerVisible(layers, isRender)
    if(target.key.endsWith("_fc") || target.key.endsWith("_sc")) {
      scfcView.value[target.key] = isRender;
      if(isRender && !showRegion.value?.id) {
        handleClickSegments("1");
      }
    }
  }
}


const clickEventsHandler = {
  "connectivity_endpoints_": handleClickEndpoints,
  "connectivity_edges_": handleClickEdges,
  "segments": handleClickSegments
}

const eventBindings = [{
    name: "selectValues",
    event: "click",
    callback: () => {
      const selectedValues = neuroRef.value.getLayerSelectedValues();
      for(let [key, value] of Object.entries(selectedValues)) {
        const type = key.split(`${props.name}_`).pop();
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
  const annotationType = layer.name.split(`${props.name}_`).pop();
  if(annotationType === "connectivity_endpoints_") {
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
    position: absolute;
    width: 16.6666666667%;
  }
  &-tooltip-box-right {
    bottom: 10px;
    right: 8px;
  }
  &-tooltip-box-left {
    top: 45%;
    left: 8px;

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
        z-index: 999;
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
      margin-top: 20px;
      height: 92vh;
      &-region-label {
        color: white;
        font-weight: 800;
        font-size: large;
        text-align: end;
        width: 100%;
      }
      :deep(.neuroglancer-panel:focus-within) {
        border:none;
      }
      
      :deep(.neuroglancer-layer-panel), :deep(.neuroglancer-viewer-top-row) {
        display: none !important;
      }

      :deep(.neuroglancer-data-panel-layout-controls) {
        display: none !important;
      }

      :deep(.neuroglancer-stack-layout-drop-placeholder) {
        background-color: #1668dc;
        background-clip:border-box;
      }
      :deep(.neuroglancer-stack-layout-column>.neuroglancer-stack-layout-drop-placeholder) {
        padding: 1px 0 0 0;
      }

      :deep(.neuroglancer-stack-layout-row>.neuroglancer-stack-layout-drop-placeholder) {
        padding: 1px 0 0 0;
      }

      :deep(.neuroglancer-layer-group-viewer-label-group) {
        font-weight: 800;
      }
      :deep(.neuroglancer-layer-group-viewer-label-sub) {
        color: #b7dcfa;
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

  &-setting {
    position: absolute;
    bottom: 10px;
    left: 8px;
    width: 16.6666666667%;
  }

  &-fc {
    position: absolute;
    top: 20px;
    right: 8px;
    width: 450px;
    height: 450px;
    z-index: 999;
  }
  &-sc {
    position: absolute;
    //bottom: 10px;
    //right: 8px;
    top:20px;
    left: 20%;
    z-index: 999;
    width:450px;
    height: 450px;
  }
}

.red {
  color: #d32029;
  font-weight: bold;
}
</style>