<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    title="BNA Macaque"
    name="macaque_bna"
    whole-segment-id="305"
    :atlas-state="atlasState"
    :plugins="{
      fc: {
        graph: true,
        fcData: {
          categories,
          data: nodes,
          links: fclinks
        }
      },
      sc: {
        graph: true,
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
import LABEL_TREE from "./labelTree";
import { atlasState, categories, nodes } from "./propsData";
import { ref } from "vue";

const fclinks = ref([]);

const sclinks = ref([]);

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