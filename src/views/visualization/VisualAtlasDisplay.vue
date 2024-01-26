<template>
  <atlas-header 
    v-bind="headerSetting"
    v-model:subpage="subpage"
    :atlas-layout="subpageLayout"
    :subpages="atlas.subpages"
    @show-helper="showHelper = true"
    @layout-change="(val) => handleLayoutChange(val)"
  />
  <el-row class="atlas-content">
    <el-col :span="4" class="atlas-content-left">
    </el-col>
    <el-col :span="16" class="atlas-content-neuro neuroglancer p-l-8 p-r-8">
      <vue-neuroglancer
        v-if="neuroRenderDatas.length"
        ref="neuroRef"
        :state="state"
      />
    </el-col>
    <el-col :span="4" class="atlas-content-right">
    </el-col>
  </el-row>

</template>
<script setup>
import { ref, computed, useSlots, provide, watch } from "vue";
import AtlasHeader from "./components/AtlasHeader.vue";
import { useAtlas } from "@/compositions/visualization/useAtlas";
import { storeToRefs } from 'pinia';
import useMediaQuery from '@/stores/mediaQuery';
import { useSubpage } from "@/compositions/visualization/useSubpage";
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";

const props = defineProps({
  atlasId: String,
  headerSetting: Object
})

const showHelper = ref(false);

const { atlas, neuroRef, renderDatas, state } = useAtlas(props);
const { subpage, neuroLayers, neuroRenderDatas, subpageLayout } = useSubpage(atlas);
const { breakpoint } = storeToRefs(useMediaQuery());
const showRegionLabel = ref(false);
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

provide('showHelper', showHelper);
provide('showRenderSetting', showRenderSetting);
provide('showRenderData', showRenderData);
provide("neuroRef", neuroRef);
provide("renderDatas", neuroRenderDatas);

provide("atlas", atlas);

watch(()=>atlas.value.subpages, (newVal, oldVal) => {
  if(!oldVal && newVal?.length) {
    subpage.value = newVal[0].id;
  }
})

watch(neuroLayers, (newLayers) => {
  state.value.layers = newLayers;
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