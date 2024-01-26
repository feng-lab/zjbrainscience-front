<template>
  <bs-widgets 
    show-close 
    header="Render Setting"
    @close="showRenderSetting = false"
  >
    <p class="sub-title">Global</p>
    <div class="between-flex">
      <span class="item-label">2D scale</span>
      <el-input-number 
        class="m-t-4" 
        size="small" 
        v-model="crossSectionScale" 
        :step="0.1" 
        :min="0"
        controls-position="right"/>
    </div>
    <div class="between-flex">
      <span class="item-label">3D scale</span>
      <el-input-number 
        class="m-t-4" 
        size="small" 
        v-model="projectionScale" 
        :step="0.1" 
        :min="0"
        controls-position="right"/>
    </div>
    <div v-if="segmentationDatas.length">
      <p class="sub-title">Volume Setting</p>
      <div class="between-flex">
        <span class="item-label"> Render data </span>
        <el-select v-model="ctrlSegmentation" style="width: 100%">
          <el-option 
            v-for="sd in segmentationDatas" 
            :key="sd.name"
            :label="sd.label"
            :value="sd.name"
          /> 
        </el-select>
      </div>
      <div class="between-flex"> 
        <span class="item-label" >Visible</span>
        <el-switch 
          v-model="renderDatas[ctrlSegmentation].show"
          @change=" val => emits('visibleChange', renderDatas[ctrlSegmentation], val)"
        />
      </div>
      <atlas-range
        title="2D Opacity"
        :trackable-value-api="(layer) => (layer.displayState.selectedAlpha)"
        :trackable-layer-api="() => (neuroRef.getManagedLayer(ctrlSegmentation).layer)"
      />
      <atlas-range
        title="3D Opacity"
        :trackable-value-api="(layer) => (layer.displayState.objectAlpha)"
        :trackable-layer-api="() => (neuroRef.getManagedLayer(ctrlSegmentation).layer)"
      />
      <atlas-range
        title="Saturation"
        :trackable-value-api="(layer) => (layer.displayState.saturation)"
        :trackable-layer-api="() => (neuroRef.getManagedLayer(ctrlSegmentation).layer)"
      />
      <atlas-range
        title="Silhouette"
        :trackable-value-api="(layer) => (layer.displayState.silhouetteRendering)"
        :trackable-layer-api="() => (neuroRef.getManagedLayer(ctrlSegmentation).layer)"
        :rangeOptions="{
          max: 10,
          step: 0.1
        }"
      />
    </div>
    <div v-if="imageDatas.length"> 
      <p class="sub-title">Image Setting</p>
      <div class="between-flex">
        <span class="item-label"> Render data </span>
        <el-select v-model="ctrlImage" style="width: 100%">
          <el-option 
            v-for="imgd in imageDatas" 
            :key="imgd.name"
            :label="imgd.label"
            :value="imgd.name"
          /> 
        </el-select>
      </div>
      <div class="between-flex"> 
        <span class="item-label" >Visible</span>
        <el-switch 
          v-model="renderDatas[ctrlImage].show"
          @change="val => emits('visibleChange', renderDatas[ctrlImage], val)"
        />
      </div>
      <div class="between-flex m-b-16"> 
        <span class="item-label">Data Range</span>
        <el-slider 
          :min="imgDataWindow[0]"
          :max="imgDataWindow[1]"
          :step="0.1"
          v-model="imgDataRange"
          :marks="imageNormalizedMarks"
          range
          style="padding: 0 16px; margin-top: 8px;"
          @input="handleImageNormalize"
        />
      </div>
      <div class="between-flex m-b-16"> 
        <span class="item-label">Invert Range</span>
        <el-switch 
          v-model="invertNormalizedRange"
          @change="handleImageNormalize"
        />
      </div>
      <div class="between-flex"> 
        <span class="item-label">Shader</span>
        <el-input type="textarea" v-model="shader" autosize/>
      </div>
    </div>
    
  </bs-widgets>
</template>

<script setup>

import { inject, onMounted, ref, watch, computed } from 'vue';
import AtlasRange from './AtlasRange.vue';

const neuroRef = inject("neuroRef");

const showRenderSetting = inject("showRenderSetting");
const renderDatas = inject("renderDatas");

/*
    "selectedAlpha": 0.8,
      "saturation": 0.31,
      "objectAlpha": 0.27,
      "meshSilhouetteRendering": 7.4,
      */


const opacity = ref();
const imgDataWindow = ref([0,0]);
const imgDataRange = ref([0,0]);

const crossSectionScale = ref();
const projectionScale = ref();
const shader = ref("");

const emits = defineEmits(["updateState", "visibleChange"])

const segmentationDatas = computed(() => {
  return Object.values(renderDatas.value).filter(rd => 
    rd.type === "neuroglancer" && rd.neuroType === "segmentation" );
})

const imageDatas = computed(() => {
  console.log('renderDatas', renderDatas.value);
  return Object.values(renderDatas.value).filter(rd => 
    rd.type === "neuroglancer" && rd.neuroType === "image" );
})

const ctrlSegmentation = ref(segmentationDatas.value[0]?.name);
const ctrlImage = ref(imageDatas.value[0]?.name);

const imageNormalizedMarks = computed(() => {
  const temp = {};
  temp[imgDataWindow.value[0]] = String(imgDataWindow.value[0]);
  temp[imgDataWindow.value[1]] = String(imgDataWindow.value[1]);
  console.log('temp', temp)
  return temp;
})

const invertNormalizedRange = ref(false);


onMounted(() => {
  const { 
    projectionScale: _projectionScale, 
    crossSectionScale: _crossSectionScale
  } = neuroRef.value.getViewerState().viewer;

  crossSectionScale.value = _crossSectionScale.value;
  projectionScale.value = _projectionScale.value;

  _projectionScale.changed.add(() => {
    if(projectionScale.value !== _projectionScale.value) {
      projectionScale.value = _projectionScale.value;
    }
  })

  _crossSectionScale.changed.add(() => {
    if(crossSectionScale.value !== _crossSectionScale.value) {
      crossSectionScale.value = _crossSectionScale.value;
    }
  })

})

watch([crossSectionScale, projectionScale], ([new2dScale, new3dScale]) => {
  console.log(new2dScale, new3dScale, typeof new2dScale, typeof new3dScale )
  if(new2dScale > 0 && new3dScale > 0) {
    emits('updateState', {
      crossSectionScale: new2dScale,
      projectionScale: new3dScale,
    })
  }
})

watch(ctrlSegmentation, (layerName) => {
  if(layerName) {
    const { layer } = neuroRef.value.getManagedLayer(layerName);
    opacity.value = layer.displayState.selectedAlpha.value; 
  }
}, {
  immediate: true
})


watch(ctrlImage, (layerName) => {
  if(layerName) {
    const { layer } = neuroRef.value.getManagedLayer(layerName);
    const { trackable } = layer.shaderControlState.value.get("toNormalized");
    const { range, window } = trackable.value;
    imgDataWindow.value = window;
    imgDataRange.value = range;
    if(range[0] > range[1]) {
      imgDataRange.value = [range[1], range[0]];
      invertNormalizedRange.value = true;
    }
  }
}, {
  immediate: true
})

const handleImageNormalize = () => {
  const { layer } = neuroRef.value.getManagedLayer(ctrlImage.value);
  const { trackable } = layer.shaderControlState.value.get("toNormalized");
  trackable.value.range = invertNormalizedRange.value ?  
    [imgDataRange.value[1], imgDataRange.value[0]] : imgDataRange.value;
  trackable.changed.dispatch();
}

</script>

<style lang="scss" scoped>
.sub-title {
  background: #1f1f1f;
  text-align: center;
  margin: 16px 0px;
}

.item-label {
  width: 60%;
  color: var(--el-color-primary);
}

:global(.el-slider__marks) {
  left: 0px;
  width: 100%;
}


.bs-atlas-slider {
  :global(.el-slider__input) {
    width: 48px;
  }

  :global(.el-slider__runway.show-input) {
    margin-right: 16px;
  }

}

</style>