<template>
  <div class="atlas-widget atlas-setting">
        <!--
    <div class="atlas-setting-item">
      <p class="atlas-setting-item-label">Layout</p>
      <div class="atlas-setting-item-content">
        <el-radio-group v-model="layout">
          <el-radio v-for="l in layouts" :key="l" :label="l">
            <span>{{ l }}</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
        -->
    <div class="atlas-setting-item">
      <p class="atlas-setting-item-label">Render Datas</p>
      <div class="atlas-setting-item-content">
        <div v-for="layer in layers" :key="layer" class="render-data">
          <span>{{ layer.label }}</span>
          <el-select 
            class="right"
            style="width: 45%"
            v-if="layer.key.startsWith('lr_')" 
            @change="val => emits('changeRenderVisible', layer, val)"
            v-model="showWhitchSideConnect"
          >
            <el-option :value="1" label="All"/>
            <el-option :value="0" label="None"/>
            <el-option value="left" label="Left"/>
            <el-option value="right" label="Right"/>
          </el-select>
          <el-switch 
            v-else 
            v-model="dataSwitchArr[layer.key]" 
            @change="val => emits('changeRenderVisible', layer, val)"
          />
        </div>
        <div class="render-data" v-if="plugins?.bdf">
          <span>Behavioral Domain</span>
          <el-switch v-model="dataSwitchArr['bdf']" @change="val => emits('changeRenderVisible', 'bdf', val)" />
        </div>
        <div class="render-data" v-if="plugins?.pcf">
          <span>Paradigm Class</span>
          <el-switch v-model="dataSwitchArr['pcf']" @change="val => emits('changeRenderVisible', 'pcf', val)" />
        </div>
        <div class="render-data" v-if="plugins?.fc?.graph">
          <span>Functional Connectivity(Graph Chart)</span>
          <el-switch v-model="dataSwitchArr['fc']" @change="val => emits('changeRenderVisible', 'fc', val)" />
        </div>
        <div class="render-data" v-if="plugins?.sc?.graph">
          <span>Structural Connectivity(Graph Chart)</span>
          <el-switch v-model="dataSwitchArr['sc']" @change="val => emits('changeRenderVisible', 'sc', val)" />
        </div>
      </div>
    </div>
    <div class="atlas-setting-item" v-if="plugins?.bigBrain">
      <div class="atlas-setting-item-label">Mesh Slice View Alpha</div>
      <div class="atlas-setting-item-content">
        <el-slider 
          :min="0" 
          :max="1" 
          :step="0.1" 
          v-model="meshAlpha" 
          show-input
          :show-input-controls="false"
          input-size="small"
          @input="val => emits('changeMeshAlpha', val)"
        />
      </div>
    </div>
    <div class="atlas-setting-item" v-if="plugins?.bigBrain">
      <p class="atlas-setting-item-label">BigBrain Data Normalized</p>
      <div class="atlas-setting-item-content render-data m-b-16">
        <span style="width: 50%">Data Range</span>
        <el-slider 
          :min="plugins?.bigBrain?.normalizeRange?.[0] ?? 0" 
          :max="plugins?.bigBrain?.normalizeRange?.[1] ?? 1" 
          v-model="normalizedRange" 
          :marks="marks"
          range
          style="padding: 0 10px; margin-top: 8px;"
          @input="handleChangeNormalize"
        />
      </div>
      <div class="atlas-setting-item-content render-data">
        <span>Invert Range</span>
        <el-switch v-model="invertNormalizedRange" @change="handleChangeNormalize"/>
      </div>
    </div>
  </div>


</template>
<script setup>
import { useAtlas } from "@/compositions/atlas/useAtlas";
import { reactive, ref } from "vue";

const { supportPlugins } = useAtlas();

const props = defineProps({
  layers: Array,
  plugins: Object,
  defaultLayout: String
})

const emits = defineEmits([
  "changeRenderVisible",
  "changeMeshAlpha",
  "changeNormalize",
  "changeLayout"
])

const dataSwitchArr = ref({})
const layouts = ["4panel", "xy-3d", "yz-3d", "xz-3d", "3sliceT", "3sliceB", "3sliceR", "3sliceL"];



const showWhitchSideConnect = ref(0);

const meshAlpha = ref(0.8)

const layout = ref(props.defaultLayout);

const defaultRange = props.plugins?.bigBrain?.normalizeRange ?? [0, 1];
const normalizedRange = ref(defaultRange);
const marks = ref({});

marks.value[defaultRange[0]] = String(defaultRange[0]);
marks.value[defaultRange[1]] = String(defaultRange[1]);

const invertNormalizedRange = ref(false);



props.layers.forEach(layer => {
  dataSwitchArr.value[layer.key] = !!layer?.defaultShow;
})

supportPlugins.forEach(plugin => {
  if(Object.keys(props?.plugins ?? []).includes(plugin)) {
    dataSwitchArr.value[plugin] = true;
  }
})


const handleChangeNormalize = () => {
  const range = invertNormalizedRange.value ? [normalizedRange.value[1], normalizedRange.value[0]] : normalizedRange.value;
  emits("changeNormalize", range)
}




</script>

<style lang="scss" scoped>
.atlas-setting {
  &-item {
    margin-bottom: 16px;
    &-label {
      color: #fff;
      &::before {
        content: "";
        border-left: 5px solid #52c41a;
        margin-right: 8px;
      }
    }
  }
}
.layer-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  gap: 16px;
}

:global(.el-slider__marks) {
  left: 0px;
  width: 100%;
}
.render-data {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>