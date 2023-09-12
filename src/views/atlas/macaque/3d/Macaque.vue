<template>
  <atlas-base
    :atlas-id="2"
    :neuroglancer-datas="neuroglancerDatas"
    :chart-datas="chartDatas"
    :sub-page="SUB_PAGE"
    :right-span="6"
  >
    <template #fc> 
      <bs-atlas-graph-chart
        ref="fcRef"
        :categories="categories"
        :data="nodes"
        link-data-dir="fc"
        :atlas-id="2"
      />
    </template>
    <template #sc> 
      <bs-atlas-graph-chart
        :categories="categories"
        :data="nodes"
        link-data-dir="sc"
        :atlas-id="2"
        ref="scRef"
      />
    </template>

  </atlas-base>
  
</template>
<script setup>
import AtlasBase from "../../AtlasBase.vue"
import BsAtlasGraphChart from "@/components/bsAtlas/BsAtlasGraphChart.vue";

import { categories, nodes } from "./propsData";
import { ref } from "vue";
//import SUB_PAGE from "../subpage.js";

const scRef = ref();
const fcRef = ref();

const SUB_PAGE = [{
  name: "macaque_3d",
  title: "3D Atlas",
  path: "/atlas/macaque_bna/3d"
}, {
  name: "macaque_nissl",
  title: "Nissl",
  path: "/atlas/macaque_bna/nissl"
}, {
  name: "macaque_tracer",
  title: "Tracer",
  path: "/atlas/macaque_bna/tracer"
}]

const neuroglancerDatas = [{
  name: "template",
  type: "image",
  label: "Template",
  transCondition: "x == 0.0 ",
  dataType: "float"
}, {
  type: "regions"
}, {
  type: "wholeBrain"
}]

const chartDatas = [{
  name: "sc",
  label: "Structural Connectivity",
  regionRelated: true,
  chartRef: scRef
}, {
  name: "fc",
  label: "Functional Connectivity",
  regionRelated: true,
  chartRef: fcRef
}]

</script>