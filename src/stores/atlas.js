import { defineStore } from "pinia";
import { ref } from "vue";
import { getAtlasRegionInfo, getAtlasRegionLinkInfo } from "@/api/atlas";
import {eeum_region_desc} from '@/locals/eeum_region_desc';

const useAtlasStore = defineStore("atlas", () => {

  const focusRegion = ref();
  const focusConnectivity = ref();

  const getFocusRegion = async (id, atlasId) => {
    if (atlasId === 4) {
      focusRegion.value = id ? (eeum_region_desc[id]) : {};
    }
    else {
      focusRegion.value = id ? (await getAtlasRegionInfo(atlasId, id)) : {};
    }
  }

  const getFocusConnectivity = async (id, atlasId) => {
    focusConnectivity.value = id ? (await getAtlasRegionLinkInfo(atlasId, id)) : {};
  }

  return {
    focusRegion,
    focusConnectivity,
    getFocusRegion,
    getFocusConnectivity
  }
})

export default useAtlasStore;