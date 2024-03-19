import { getLayerHandler } from "@/views/visualization/layerHandler/index";
import { subpageDetailApi } from "@/views/visualization/testApi";
import { ref, watch } from "vue";



export function useSubpage(atlas) {
  const subpage = ref();
  const neuroRenderDatas = ref({});
  const neuroLayers = ref([]);
  const subpageLayout = ref("4panel");
  const ownerAtlas = atlas;

  const changeSubpage = async (id) => {
    neuroLayers.value = [];
    const { rootPath } = ownerAtlas.value;
    const subpageDetail = await subpageDetailApi(id);
    const { datas, name:subpageName, referenceData,  neuroDataLayout } = subpageDetail;
    subpageLayout.value = neuroDataLayout;
    neuroRenderDatas.value = [
      ...referenceData.map(d => ({...d, path: `precomputed://${d.path}`})), 
      ...datas
    ];

    for(let data of neuroRenderDatas.value) {
      const handler = getLayerHandler(data.type);
      const layerHandler = new handler(data, rootPath, subpageName);
      const neuroLayer = layerHandler.parseData();
      if(data.type === "image") {
        neuroLayers.value = [
          ...neuroLayer,
          ...neuroLayers.value
        ]
      } else {
        neuroLayers.value = [
          ...neuroLayers.value,
          ...neuroLayer
        ]
      }
    }
  }

  watch(subpage, (page) => {
    changeSubpage(page);
  })

  return {
    subpage,
    neuroLayers,
    neuroRenderDatas,
    changeSubpage,
    subpageLayout
  }
}