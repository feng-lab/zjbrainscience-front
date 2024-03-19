import { useBsAtlasBaseUrl } from "./useBsAtlas";
import { useSegmentationLayer } from "./useSegmentationLayer";
import { ref } from "vue";
import { getAtlasRegionInfo } from "@/api/atlas";
import {eeum_region_desc} from '@/locals/eeum_region_desc';

import useAtlasStore from "@/stores/atlas";
import { storeToRefs } from "pinia";

export function useRegionHandler(atlasId) {
  const focusRegion = ref();
  const selectRegion = ref();
  const handleSelectRegion = async (regionId, renderDatas, neuroRef, updateState=()=>{}) => {
    const selectRegionId = typeof(regionId) === "object" ? (regionId?.value?.key ?? regionId.value) : regionId;
    if (selectRegionId && selectRegionId !== "0" && selectRegionId !== String(selectRegion.value?.region_id)) {
      if (atlasId === 4) {
        selectRegion.value = eeum_region_desc[selectRegionId]
      } else {
        selectRegion.value = await getAtlasRegionInfo(atlasId, selectRegionId); //select region info
      }
      for(let rdInfo of Object.values(renderDatas.value).filter(rd => rd.show)) {
        const { type, regionRelated=false} = rdInfo;
        if (type === "chart" && regionRelated) {
          rdInfo.chartRef.handleSelect(selectRegionId, selectRegion.value.acronym)
        } else if(type === "neuroglancer" && regionRelated) {
          neuroRef.value.setVisibleSegments(rdInfo.name, []);
          neuroRef.value.setVisibleSegments(rdInfo.name, [selectRegionId]);
        }
      }

      const currentStateJ = neuroRef.value.getViewerState().toJSON();
      const { layout } = currentStateJ;

      if(typeof layout === "object" ) {
        const childrenForScfc = layout.children[1];
        const scfcPanels = childrenForScfc.type === "viewer" ? [childrenForScfc] : childrenForScfc.children;
        const scfcPanelChildren = scfcPanels.map(x => ({ 
          ...x, 
          subGroupLabel: `${selectRegion.value.acronym}(ID: ${selectRegion.value.region_id})`
        }))
        if(childrenForScfc.type === "viewer") {
          layout.children[1] = scfcPanelChildren[0];
        } else {
          layout.children[1].children = scfcPanelChildren;
        }
      }
      updateState({
        layout
      })

    }
  }

  return {
    focusRegion,
    selectRegion,
    handleSelectRegion
  }

}

//export async function useBrainRegionsLayer(atlasName, options={}, layerFocusHandler ) {
export function useBrainRegionsLayer(atlasName, options={}, layerFocusHandler ) {
  const { getFocusRegion } = useAtlasStore();
  const { baseUrl } = useBsAtlasBaseUrl(atlasName);
  //const { layers } = await useSegmentationLayer(
  const { layers } = useSegmentationLayer(
    baseUrl, atlasName, 
    { 
      name: "segmentation", 
      options,
      label: "Brain Regions"
    });
  
    console.log('region', layers)

  
  layerFocusHandler.value[layers[0].name] = getFocusRegion;

  return {
    layers
  }
}