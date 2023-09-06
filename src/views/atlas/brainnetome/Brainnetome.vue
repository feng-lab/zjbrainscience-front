<template>
  <atlas-base
    :atlas-id="1"
    :neuroglancer-datas="neuroglancerDatas"
    :chart-datas="chartDatas"
  >
    <template #bdf> 
      <bs-sunburst-chart
        ref="bdfRef"
        title="Behaviorial Domains"
        :fetch-tree-api="getBehavioralDomainTrees"
        :fetch-detail-api="getRegionBehavioralDomain"
        :atlas-id="1"
      />
    </template>
    <template #pcf> 
      <bs-sunburst-chart
        ref="pcfRef"
        title="Paradigm Class"
        :fetch-tree-api="getParadigmClassTrees"
        :fetch-detail-api="getRegionParadigmClass"
        :graph-radius="['60%', '75%']"
        :atlas-id="1"
      />
    </template>
  </atlas-base>
</template>

<script setup>
import { ref } from "vue";
import AtlasBase from '../AtlasBase.vue';

import { getBehavioralDomainTrees, getRegionBehavioralDomain } from "@/api/bdf";
import { getParadigmClassTrees, getRegionParadigmClass } from "@/api/pcf";
import BsSunburstChart from "@/components/bsAtlas/BsSunburstChart.vue";

const bdfRef = ref();
const pcfRef = ref();

const neuroglancerDatas = [{
  name: "bigbrain",
  label: "Big Brain",
  type: "image", 
  options: {
    transform: {
      "matrix": [
        [ 0.0789, 0, 0, -3.5 ],
        [ 0, 0.0789, 0, -5.5 ],
        [ 0, 0, 0.0789, 0.5 ]
      ],
      "outputDimensions": {
        "x": [ 0.00125, "m" ],
        "y": [ 0.00125, "m" ],
        "z": [ 0.00125, "m" ]
      }
    },
  },
  transCondition: "float(x.value) > 65500.0",
  dataType: "uint16_t"
}, {
  type: "regions",
  options: {
    removeOctant: true
  }
}, {
  type: "wholeBrain"
}, {
  name: "sc",
  label: "Structural Connectivity",
  type: "segmentation",
  regionRelated: true,
  defaultHidden: true,
  options: {
    disableResponseDblclick0Event: true,
  }
}, {
  name: "fc",
  label: "Functional Connectivity",
  type: "segmentation",
  regionRelated: true,
  defaultHidden: true,
  options: {
    disableResponseDblclick0Event: true,
  }
}, {
  type: "connectivity",
  connectivityType: "whole",
  defaultHidden: true
}]

const chartDatas = [{
  name: "bdf",
  label: "Behaviorial Domains",
  regionRelated: true,
  chartRef: bdfRef
}, {
  name: "pcf",
  label: "Paradigm Class",
  regionRelated: true,
  chartRef: pcfRef,
}]

</script>