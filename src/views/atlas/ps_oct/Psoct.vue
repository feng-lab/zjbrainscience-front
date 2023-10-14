<template> 
  <atlas-base
    :atlas-id="atlasId"
    :neuroglancer-datas="neuroglancerDatas"
  />
  <el-image :src="ColorWheel" fit="fill" class="color-wheel"/>
</template>

<script setup>
import AtlasBase from '../AtlasBase.vue';
import ColorWheel from "@/assets/img/hsvColorWheel.png";

const atlasId = 6;

const neuroglancerDatas = [{
  name: "brain",
  type: "image",
  label: "Brain Template",
  options: {
    shader: "#uicontrol invlerp toNormalized(range=[0, 230], window=[0,230])\nvoid main() {\n  emitGrayscale(toNormalized());\n}\n",
  }
}, {
  name: "retardance",
  type: "image",
  label: "Retardance",
  options: {
    shader: "#uicontrol invlerp toNormalized(range=[-1.5078, 1.5078], window=[-1.5078, 1.5078])\n\nvoid main() {\n  emitRGB(hueToRgb(toNormalized()));\n}\n",
  }
}, {
  name: "axisorient",
  type: "image",
  label: "Axisorient",
  options: {
    shader: "#uicontrol invlerp toNormalized(range=[-1.5078, 1.5078], window=[-1.5078, 1.5078])\n\nvoid main() {\n  \temitRGB(hueToRgb(toNormalized()));\n  }\n",
  },
  defaultHidden: true
}]

</script>

<style lang="scss" scoped>
.color-wheel {
  position: absolute;
  bottom: 8px;
  left: 8px;
  z-index: 99;
  width: 150px;
  height: 150px;
}
</style>