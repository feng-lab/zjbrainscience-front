<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    title="BNA Macaque"
    name="macaque_bna"
    whole-segment-id="305"
    :atlas-state="atlasState"
    :plugins="{
      template: templateLayer,
      fc: {
        graph: true,
        defaultVisible: false,
        fcData: {
          categories,
          data: nodes,
          links: fclinks
        }
      },
      sc: {
        graph: true,
        defaultVisible: false,
        scData: {
          categories,
          data: nodes, 
          links: sclinks
        }
      } 
    }"
    @segment-selected="handleSegmentSelected"
  />
  
</template>
<script setup>
import BsAtlas from "@/components/bsAtlas/BsAtlas.vue";
import LABEL_TREE from "../labelTree";
import { atlasState, categories, nodes } from "./propsData";
import { ref } from "vue";

const fclinks = ref([]);

const sclinks = ref([]);
const templateLayer = {
  "shader": "#uicontrol invlerp  toNormalized\nvoid main() {\n  float x = getDataValue();\n  if(x==0.0) {\n    emitTransparent();\n  } else {\n    emitGrayscale(toNormalized(x));\n  }\n}\n",
}

const handleSegmentSelected = (segmentInfo) => {
  const fcUrl = `/macaque/fc/${segmentInfo.Acronym}_data.json`;
  const scUrl = `/macaque/sc/${segmentInfo.Acronym}_data.json`;
  fetch(fcUrl).then(response=> {
    return response.text();
  }).then(res => {
    const resJ = JSON.parse(res);
    fclinks.value = resJ.links;
  })

  fetch(scUrl).then(response=> {
    return response.text();
  }).then(res => {
    const resJ = JSON.parse(res);
    sclinks.value = resJ.links;
  })

}

</script>