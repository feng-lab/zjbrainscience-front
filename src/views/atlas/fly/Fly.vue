<template>
  <atlas-base
    :atlas-id="atlasId"
    :neuroglancer-datas="neuroglancerDatas"
  > 

  </atlas-base>
  
</template>


<script setup>

import AtlasBase from "../AtlasBase.vue"

const atlasId = 5;
const neuroglancerDatas = [{
  name: "image",
  label: "Template Image",
  type: "image",
  dataType: "uint8_t"
}, {
  name: "synapse",
  label: "Synapse",
  type: "annotation",
  options: {
    shader: "\nvoid main() {\n  setColor(defaultColor());\n  setEndpointMarkerColor(\n    vec3( 1.0, 0.0, 0.0),\n    vec3(0.0, 1.0, 0.0));\n  setEndpointMarkerSize(7.0);\n}\n"
  }
}, {
  name: "bbox",
  label: "Bbox",
  type: "segmentation",
}, {
  name: "cleft",
  label: "Cleft",
  type: "segmentation",
}, {
  name: "seg",
  label: "Seg",
  type: "segmentation",
}, {
  name: "synapse_ovals",
  label: "Synapse Ovals",
  type: "annotation",
  options: {
    shader: "\nvoid main() {\n  setColor(vec4(1.0, 0.0, 1.0, 0.6));\n  }\n"
  }
}, {
  name: "inference",
  label: "Inference",
  type: "annotation",
}, {
  name: "inference_strip",
  label: "Inference Strip",
  type: "annotation",

}]
</script>