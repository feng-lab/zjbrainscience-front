<template>
  <bs-atlas
    :tree-data="LABEL_TREE"
    title="Brainnetome"
    name="bn_atlas"
    site="http://www.brainnetome.org"
    whole-segment-id="275"
    :atlas-state="atlasState"
    :connectivity-edges="connectivityEdges"
    :connectivity-endpoints="connectivityEndpoints"
    :plugins="{
      bdf: true,
      pcf: true,
      connectivity: true
    }"
    :bdf-data="{
      bdfTree,
      bdfTooltipInfo,
      dataMap: bdfDataMap
    }"
    :pcf-data="{
      pcfTree,
      pcfTooltipInfo,
      dataMap: pcfDataMap
    }"
  />
</template>

<script setup>
import LABEL_TREE from "./labelTree";
import { atlasState, connectivityEdges, connectivityEndpoints } from "./propsData";
import BsAtlas from "@/components/bsAtlas/BsAtlas.vue";

import bdfTree from "@/atlas_data/BDF_tree";
import bdfTooltipInfo from "@/atlas_data/exp_BehavioralDomain";
import bdfDataMap from "@/atlas_data/BDf_FDR05";

import pcfTree from "@/atlas_data/PCF_tree";
import pcfTooltipInfo from "@/atlas_data/exp_ParadigmClass";
import pcfDataMap from "@/atlas_data/PCf_FDR05";

</script>