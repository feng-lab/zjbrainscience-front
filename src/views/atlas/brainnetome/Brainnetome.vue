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
    :remove-octant="true"
    :plugins="{
      fc: {
        spatial: true
      },
      sc: {
        spatial: true
      },
      bdf: {
        bdfData: {
          bdfTree,
          bdfTooltipInfo,
          dataMap: bdfDataMap
        }
      },
      pcf: {
        pcfData: {
          pcfTree,
          pcfTooltipInfo,
          dataMap: pcfDataMap
        }
      },
      connectivity: true,
      bigBrain: {
        metaData: bigBrainParam,
        normalizeRange: [0, 65535]
      } 
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

const bigBrainParam = {
  "transform": {
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
  "shader": "#uicontrol invlerp  toNormalized\nvoid main() {\n  uint16_t x = getDataValue();\n  if(float(x.value) > 65500.0) {\n    emitTransparent();\n  } else {\n    emitGrayscale(toNormalized(x));\n  }\n}\n"
}

</script>