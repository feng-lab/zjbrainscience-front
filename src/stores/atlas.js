import { defineStore } from "pinia";
import { ref } from "vue";
import { getAtlasRegionInfo, getAtlasRegionLinkInfo } from "@/api/atlas";
import { getAllSpeciesInfoApi } from '@/api/datasetManagement'

const useAtlasStore = defineStore("atlas", () => {

  const focusRegion = ref();
  const focusConnectivity = ref();
  const speciesOptions = ref([])

  const getFocusRegion = async (id, atlasId) => {
    focusRegion.value = id ? (await getAtlasRegionInfo(atlasId, id)) : {};
  }

  const getFocusConnectivity = async (id, atlasId) => {
    focusConnectivity.value = id ? (await getAtlasRegionLinkInfo(atlasId, id)) : {};
  }

  const getAllSpeciesInfo = async () => {
    try {
      const data = await getAllSpeciesInfoApi({ limit: 1000 })
      speciesOptions.value = data.items || []
    } catch (err) {
      console.log(err)
    }
  }
  getAllSpeciesInfo()

  return {
    focusRegion,
    focusConnectivity,
    speciesOptions,
    getFocusRegion,
    getFocusConnectivity,
    // getAllSpeciesInfo,
  }
})

export default useAtlasStore;