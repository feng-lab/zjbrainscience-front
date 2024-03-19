import { computed, ref, render, watch } from "vue";
import panel4 from "@/assets/img/4panel.png";
import sliceT from "@/assets/img/3sliceT.png";
import sliceR from "@/assets/img/3sliceR.png";
import sliceB from "@/assets/img/3sliceB.png";
import sliceL from "@/assets/img/3sliceL.png";
import xy3d from "@/assets/img/xy-3d.png";
import xz3d from "@/assets/img/xz-3d.png";
import yz3d from "@/assets/img/yz-3d.png";

export function useBrainAtlasLayout(layout="4panel") {
  const regionLayout = ref("")
  regionLayout.value = layout

  const supportLayout = [
    { layout: "4panel", component: panel4, tooltip: "Display 3D view and three 2D cross-section views in four grids"},
    { layout:"3sliceT", component: sliceT, tooltip: "Display 3D view with three 2D cross-section views on the top of it"},
    { layout:"3sliceR", component: sliceR, tooltip: "Display 3D view with three 2D cross-section views on the right of it"},
    { layout:"3sliceB", component: sliceB, tooltip: "Display 3D view with three 2D cross-section views on the bottom of it"},
    { layout:"3sliceL", component: sliceL, tooltip: "Display 3D view with three 2D cross-section views on the left of it"},
    { layout:"xy-3d", component: xy3d, tooltip: "Display 3D view and XY view" },
    { layout:"xz-3d", component: xz3d, tooltip: "Display 3D view and XZ view" },
    { layout:"yz-3d", component: yz3d, tooltip: "Display 3D view and YZ view" },
    { layout:"3d", component: "3d", tooltip: "Display 3D view"},
    { layout:"xy", component: "xy", tooltip: "Display XY view"},
    { layout:"xz", component: "xz", tooltip: "Display XZ view"},
    { layout:"yz", component: "yz", tooltip: "Display YZ view"}
  ];

  const getAtlasLayout = (renderDatas, showRegion) => {
    const children = []

    const scfcDatas = [];
    let defaultDatas  = [];

    for(let layer of Object.keys(renderDatas.value).filter( rd => renderDatas.value[rd].type === "neuroglancer")) {
      const { name, subLayer } = renderDatas.value[layer];

      if (name.endsWith("_sc") || name.endsWith("_fc")) {
        scfcDatas.push(name);
        continue;
      }

      if(subLayer) {
        defaultDatas = [
          ...defaultDatas,
          ...subLayer
        ];
      } else {
        defaultDatas.push(name);
      }
    }

    for(let k of scfcDatas) {
      const v = renderDatas.value[k];
      if(v.show) {
        const layers = [k];
        let groupLabel = `Functional Connectivity`;
        if(k.endsWith("_sc")) {
          layers.push(k.replace('_sc', '_whole'));
          groupLabel = "Structural Connectivity";
        }
        children.push({
          type: "viewer",
          layers,
          layout: "3d",
          flex:1,
          groupLabel,
          subGroupLabel: showRegion.region_id ? `${showRegion.acronym}(ID: ${showRegion.region_id})` : ""
        })
      }
    }
    if(!children.length) {
      return regionLayout.value;
    }
    if(children.length === 1) {
      const notVisible = scfcDatas.filter(k => !renderDatas.value[k].show)[0]; 
      children[0].layers.push(notVisible);
    }
    return {
      type: "row",
      children: [{
          type: "viewer",
          layers: defaultDatas,
          layout: regionLayout.value,
          flex: children.length > 1 ? 2 :1
        },
        {
          type: "column",
          children, 
          flex: 1
        }]
    }
  }


  return {
    regionLayout,
    supportLayout,
    getAtlasLayout
  }


}