<template>
  <h1 style="color: #fff" class="p-16">
    Lemur Cell Detection
  </h1>
  <div style="height: 90vh; margin-top: 20px">
    <vue-neuroglancer
      :state=state
    />
  </div>
</template>

<script setup>
import { VueNeuroglancer } from "@feng-lab/vue-neuroglancer";
import "@feng-lab/vue-neuroglancer/style/index.css";
import { ref } from "vue";
const state = ref({
  "dimensions": {
    "x": [
      6.52761e-7,
      "m"
    ],
    "y": [
      6.52761e-7,
      "m"
    ],
    "z": [
      0.0001,
      "m"
    ]
  },
  "position": [
    14502.037109375,
    11144.4072265625,
    93.89682006835938
  ],
  "crossSectionScale": 509.98178020908955,
  "projectionOrientation": [
    -0.01049714908003807,
    -0.09233428537845612,
    -0.06686804443597794,
    0.9934248328208923
  ],
  "projectionScale": 32767.999999999993,
  "layers": [
    {
      "type": "annotation",
      "source": "precomputed://http://10.11.40.170:2000/atlas_data/lemur/NeuN_detection_sephere",
      "tab": "rendering",
      "shader": "\nvoid main() {\n  setColor(defaultColor());\n  setSphereRadius(0.001);\n}\n",
      "name": "NeuN_detection_sephere"
    },
  ],
  "layout": "3d"
})

</script>