<template>
  <el-row class="fly">
    <el-col :span=4 class="p-t-20">
      <h1 style="color: #fff">Fly</h1>
    </el-col>
    <el-col :span=20>
      <atlas-header
        :atlas-props="atlasProps"
        :segments-layout="state.layout"
        @layout-change="handleLayoutChange"
      />
      <div class="neuroglancer neuro p-l-16 ">
        <vue-neuroglancer
          ref="neuroRef"
          :state="state"
        />

      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import { useAtlas } from '@/compositions/atlas/useAtlas';
import AtlasHeader from '../AtlasHeader.vue';
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import { onMounted, ref } from 'vue';

const atlasProps = {
  name: "fly"
}

const {
  neuroRef,
  atlasUrl
} = useAtlas(atlasProps);


const state = ref({
  "crossSectionBackgroundColor": "#15325b",
  "crossSectionBackgroundAlpha": 0.1,
  "showDefaultAnnotations": false,
  "sliceViewCrossSectionBgColor": "#ffffff",
  "sliceViewCrossSectionBgAlpha": 0.7,
  "selectedLayer": {},
  "layout": "4panel"
});


const handleLayoutChange = (layout) => {
  state.value.layout = layout;
}

onMounted(() => {
  fetch(`${atlasUrl}/${atlasProps.name}/state.json`).then(response => {
    return response.json();
  }).then(data => {
    state.value = {
      ...data,
      ...state.value
    };
  })
});

</script>

<style lang="scss" scoped>
.fly {
  height: 100vh;
  padding: 0px 8px;
  .neuro {
    height: calc(100vh - 20px - 75px);
  }

}
</style>