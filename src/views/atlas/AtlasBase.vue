<template>
  <atlas-header 
    v-bind="{
      ...atlasInfo,
      ...headerSetting
    }"
    :atlas-layout="regionLayout"
    :sub-page="subPage"
    @show-helper="showHelper = true"
    @layout-change="(val) => handleLayoutChange(val)"
  />
  <el-row class="atlas-content">
    <el-col :span="leftSpan" class="atlas-content-left">
      <slot name="left">
        <bs-widgets header="Select Brain Regions" v-if="showRegionLabel">

          <el-input 
            v-model="filterText" 
            placeholder="Search region by id or label" 
            clearable
            class="atlas-input m-b-8 m-t-8"
          />
            <el-tree
              ref="treeRef"
              :data="regionsLabelTree"
              multiple
              node-key="region_id"
              show-checkbox
              @check="checkTreeNode"
              :filter-node-method="filterTreeNode"
              :default-expanded-keys="[0]"
              class="atlas-widget-"
              :accordion="true"
            >
              <template #default="{node, data}">
                <el-tooltip 
                  :content="`${node.label}, ID: ${data.region_id}`" 
                  placement="right" 
                  v-if="data.region_id"
                >
                  <span 
                    style="overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ `${data.label.replace(/^.*\((.*)\).*/, '$1')} (ID: ${data.region_id})` }}
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
        </bs-widgets>
        <bs-region-tooltip
          v-if="focusRegion?.region_id"
          :focus-region="focusRegion"
        />
        <bs-widgets header="Connectivity" v-if="focusConnectivity?.id" style="flex-grow: 1">
          <p class="between-flex"> 
            <span class="conn-label">
              <span> {{ focusConnectivity.region1 }} </span>
              <bs-icon-img icon="Right" v-if="focusConnectivity.opposite_value"/>
              <bs-icon-img icon="Switch" v-else/>
              <span> {{ focusConnectivity.region2}} </span> 
            </span>
            <span class="m-l-8 red" v-if="focusConnectivity.value">{{Number(focusConnectivity.value).toExponential()}}</span>
          </p>
          <p v-if="focusConnectivity.opposite_value" class="between-flex"> 
            <span class="conn-label">
              <span> {{ focusConnectivity.region2 }} </span>
              <bs-icon-img icon="Back" />
              <span>{{ focusConnectivity.region1 }} </span>
            </span>
            <span class="m-l-8 red">{{Number(focusConnectivity.opposite_value).toExponential()}}</span>
          </p>
        </bs-widgets>

      </slot>
    </el-col>
    <el-col :span= "neuroSpan" class="atlas-content-neuro neuroglancer p-l-8 p-r-8">
      <slot name="neuro">
        <vue-neuroglancer
          v-if="neuroglancerDatas.length"
          ref="neuroRef"
          :state="state"
          :event-bindings="eventBindings"
          @toggle-segment="handleToggleSegment"
          @focus-segment-changed="handleFocusLayerChanged"
          @focus-annotation-changed="handleFocusLayerChanged"
        />
      </slot>
    </el-col>
    <el-col :span= "chartSpan" class="atlas-content-right">
      <slot name="right">
        <div v-for="chart in Object.keys(renderDatas).filter(rd => renderDatas[rd].type === 'chart')" :key="chart">
          <bs-widgets :header="renderDatas[chart].label" v-if="renderDatas[chart].show"> 
            <slot :name="chart"/>
          </bs-widgets>
        </div>
      </slot>
    </el-col>
    <el-col :xs="5" :sm="5" :lg="4" class="atlas-content-setting p-l-8" v-if="showSettingPanel">
      <bs-widgets header="Render Data" v-if="showRenderData" show-close @close="showRenderData = false">
        <div v-for="(rd, key) in renderDatas" :key="key" class="between-flex"> 
          <span> {{ rd.label }} </span>
          <el-select 
            class="right"
            style="width: 45%"
            v-if="rd?.connectivityType === 'lr'"
            @change="val => handleDataVisibleChange(rd, val)"
            v-model="rd.show"
          >
            <el-option :value="1" label="All"/>
            <el-option :value="0" label="None"/>
            <el-option value="left" label="Left"/>
            <el-option value="right" label="Right"/>
          </el-select>
          <el-switch v-else v-model="rd.show" @change="val => handleDataVisibleChange(rd, val)"/>
        </div>
      </bs-widgets>
      <atlas-render-setting 
        v-if="showRenderSetting"
        @update-state="updateState"
        @visible-change="handleDataVisibleChange"
      />
      <atlas-helper v-if="showHelper"/>
    </el-col>
  </el-row>
  
</template>

<script setup>
import AtlasHeader from './AtlasHeader.vue';
import AtlasHelper from './AtlasHelper.vue';
import BsWidgets from '@/components/bsAtlas/BsWidgets.vue';
import BsRegionTooltip from '@/components/bsAtlas/BsRegionTooltip.vue';

import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";

import { useBsAtlas } from '@/compositions/bsAtlas/useBsAtlas';
import { useRegionsLabelTree } from '@/compositions/bsAtlas/useRegionsLabelTree';
import { useBrainAtlasLayout } from '@/compositions/bsAtlas/useBrainAtlasLayout';
import { useRegionHandler } from '@/compositions/bsAtlas/useBrainRegionsLayer';
import { storeToRefs } from 'pinia';
import useAtlasStore from '@/stores/atlas';
import { computed, nextTick, onMounted, provide, ref, useSlots } from "vue";
import AtlasRenderSetting from './AtlasRenderSetting.vue';
import useMediaQuery from '@/stores/mediaQuery';

const props = defineProps({
  atlasId: {
    type: Number,
    required: true
  },
  subPage: Array,
  chartDatas: {
    type: Array,
    default: []
  }, 
  neuroglancerDatas: {
    type: Array,
    default: []
  },
  rightSpan: {
    type: Number,
    default: 4
  },
  rightCustom: Boolean,
  headerSetting: Object
})

const showHelper = ref(false);


const showRegionLabel = props.neuroglancerDatas.filter(d => d.type === "regions" && !d?.notShowLabelTree).length > 0;



const {
  neuroRef,
  state,
  renderDatas,
  atlasInfo,
  updateState,
  setLayerVisible,
  layerFocusHandler
} = useBsAtlas(props);


const { breakpoint } = storeToRefs(useMediaQuery());

//const slots = useSlots();

const isNarrowScreen = () => {
  return breakpoint.value !== "lg" && breakpoint.value !== "xl";
}

const leftSpan = computed(() => {
  const slots = useSlots();
  const { left = null } = slots;
  if(!left && !showRegionLabel) {
    return 0;
  }
  return isNarrowScreen() ? 5 : 4;
})

const showRenderData = ref(!leftSpan.value);
const showRenderSetting = ref(false);
const showSettingPanel = computed(() => showHelper.value || showRenderSetting.value || showRenderData.value);

const chartSpan = computed(() => {
  if(Object.values(renderDatas.value).filter(rd => rd.type === "chart" && rd.show).length || props.rightCustom) {
    return props.rightSpan + !!isNarrowScreen();
  } else {
    return 0;
  }
})

const neuroSpan = computed(() => {
  const settingSpan = showSettingPanel.value ? 4 + !!isNarrowScreen() : 0;
  return 24 - chartSpan.value - settingSpan - leftSpan.value;
})



const {
  regionLayout,
  getAtlasLayout
} = useBrainAtlasLayout();


const {
  treeRef,
  regionsLabelTree,
  filterText,
  checkTreeNode,
  filterTreeNode
} = useRegionsLabelTree(neuroRef, atlasInfo, props.atlasId, showRegionLabel);

const {
  selectRegion,
  handleSelectRegion
} = useRegionHandler(props.atlasId);

const handleClickEndpoints = (point) => {
  const { annotationId=null } = point;
  if(annotationId) {
    const checkedKeys = treeRef.value.getCheckedKeys();
    checkedKeys.forEach(k => treeRef.value.setChecked(k, false));
    treeRef.value.setChecked(annotationId, true);
    neuroRef.value.setVisibleSegments(`${atlasInfo.value.name}_regions`, [annotationId]);
    handleSelectRegion(sid);
  }
}


const clickEventsHandler = {
  "endpoints": handleClickEndpoints,
  "regions": async (id) => await handleSelectRegion(id, renderDatas, neuroRef, updateState)
}

const eventBindings = [{
    name: "selectValues",
    event: "click",
    callback: () => {
      const selectedValues = neuroRef.value.getLayerSelectedValues();
      for(let [key, value] of Object.entries(selectedValues)) {
        let type = key.split(`${atlasInfo.value.name}_`).pop();
        type = type.startsWith("connectivity_") ? type.split('_')[1] : type;

        const handler = clickEventsHandler[type];
        if(handler) {
          handler(value);
        }
      }
    }
}]

const handleShowHelper = () => {
  console.log('show helper', showHelper.value)
  if(!showHelper.value) {
    showHelper.value = true;
  }
}

const { focusRegion, focusConnectivity } = storeToRefs(useAtlasStore()); 

const handleCloseHelper = () => {
  showHelper.value = false;
}

const handleLayoutChange = (layout) => {
  regionLayout.value = layout;
  const newLayout = getAtlasLayout(renderDatas, selectRegion.value);
  updateState({
    layout: newLayout
  })
}    

const handleFocusLayerChanged = async (targetId, layer) => {
  const handler = layerFocusHandler.value[layer.name];
  if(handler) {
    await handler(targetId, props.atlasId);
  }
}


let _projectionScale = null;
let _crossSectionScale = null;

const handleDataVisibleChange = (renderData, isRender) => {
  const { name, type, regionRelated=false, subLayer=null } = renderData;
  console.log('visible change', renderData)

  if(regionRelated && isRender ) {
    nextTick(async()=> {
      await handleSelectRegion(selectRegion.value?.region_id ?? "1", renderDatas, neuroRef);
    })
  }

  if(type === "neuroglancer") {
    let layers = subLayer ?? [renderData.name];
    if( renderData?.connectivityType === "lr") {
      const regionLayer = neuroRef.value.getManagedLayer(`${atlasInfo.value.name}_regions`);
      regionLayer.layer.displayState.silhouetteRendering.value = Number(!!isRender);
      if(typeof isRender === "string") {
        setLayerVisible(subLayer, false);
        layers = subLayer.filter(l => l.endsWith(`_${isRender}`))
      }
    }

    setLayerVisible(layers, isRender);


    if(name.endsWith('_fc') || name.endsWith('_sc')) {
      const newLayout = getAtlasLayout(renderDatas, selectRegion.value);

      const currentStateJ = neuroRef.value.getViewerState().toJSON();

      if(!_projectionScale) {
        _projectionScale = currentStateJ.projectionScale;
      }
      if(!_crossSectionScale) {
        _crossSectionScale = currentStateJ.crossSectionScale;
      }
      const notGroupViewr = typeof newLayout === "string";

      const projectionScale = notGroupViewr ? _projectionScale: _projectionScale*1.3;
      const crossSectionScale = notGroupViewr ?  _crossSectionScale : _crossSectionScale * 1.3;

      updateState({
        layout: newLayout,
        crossSectionScale,
        projectionScale,
      })
    }
  }
}

const handleToggleSegment = (segmentInfo, layer) => {
  if(layer.name.endsWith("_regions")) {
    const { segment, visible } = segmentInfo;
    treeRef.value.setChecked(segment, visible);
  }
}

provide('showHelper', showHelper);
provide('showRenderSetting', showRenderSetting);
provide('showRenderData', showRenderData);
provide("neuroRef", neuroRef);
provide("renderDatas", renderDatas);

onMounted(() => {
  const showRelatedRegionInfoDefault = [...props.neuroglancerDatas, ...props.chartDatas].some(rd => rd.regionRelated && !rd?.defaultHidden);
  if(showRelatedRegionInfoDefault) {
    handleSelectRegion("1", renderDatas, neuroRef);
  }
})


</script>

<style lang="scss" scoped>
.atlas-content {
  height: calc(100vh - 83px);
  @media only screen and (max-width: 1024px){
    height: calc(100vh - 127px);
  }
  &-left, &-right, &-setting {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &-left > * {
    flex: 2 1 0%;
    overflow: auto;
  }

  &-setting > * {
    flex: 1 1 0%;
    overflow: hidden;
  }

  .conn-label {
    width: 60%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    >* {
      flex: 1;
    }
    .direct-icon {
      transform: rotate(90deg);
    }
  }

}
</style>