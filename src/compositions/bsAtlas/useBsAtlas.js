import { getAtlasInfo, getAtlasByPage } from "@/api/atlas";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useBrainRegionsLayer } from "./useBrainRegionsLayer";
import { useWholeBrainLayer } from "./useWholeBrainLayer";
import { useSegmentationLayer } from "./useSegmentationLayer";
import { useConnectivityLayer } from "./useConnectivityLayer";
import { getImageLayerShader, useBsImage } from "./useBsImage";
import { useRouter } from "vue-router";
import { useAnnotationLayer } from "./useAnnotationLayer";
import useAtlasStore from "@/stores/atlas";

export function useBsAtlasBaseUrl(atlasName) {
  return {
    baseUrl: `http://${window.location.host}/atlas_data/eeum_test2/` //${atlasName}
  }
}


export function useBsAtlasList() {
  const atlasList = ref([
    {
      "id": 4,
      "gmt_create": "2023-09-01 15:46:17",
      "gmt_modified": "2023-09-01 15:46:17",
      "is_deleted": false,
      "name": "eeum",
      "url": "https://eeum-brain.com",
      "title": "Eeum",
      "whole_segment_id": 997
   }
  ]);

  const router = useRouter();

  const handleViewAtlas = (atlas) => {
    router.push(`/atlas/${atlas}`);
  }

  // onMounted(async () => {
  //   const { count, items } = await getAtlasByPage();
  //   atlasList.value = items;
  // })

  return {
    atlasList,
    handleViewAtlas
  }

}


export function useBsAtlas(props) {
  const neuroRef = ref();
  const atlasInfo = ref({
    "id": 4,
    "gmt_create": "2023-09-01 15:46:17",
    "gmt_modified": "2023-09-01 15:46:17",
    "is_deleted": false,
    "name": "eeum",
    "url": "https://eeum-brain.com",
    "title": "Eeum",
    "whole_segment_id": 997
})

  const state = ref({
    showAxisLines: true,
    showDefaultAnnotations: false,
    sliceViewCrossSectionBgColor: "#141414",
    //crossSectionBackgroundColor: "#3c89e8",
    crossSectionBackgroundColor: "#364d79",
    crossSectionBackgroundAlpha: 0.2,
    layers: []
  });

  const layerFocusHandler = ref({});
  const renderDatas = ref({});
  const Layers = ref([]);


  if (props.chartDatas && props.chartDatas.layers && props.chartDatas.layers.length > 0) {
    props.chartDatas.layers.forEach(l => {
      renderDatas.value[l.name] = {
        ...l,
        type: "chart",
        show: ref(!l.defaultHidden)
      }
    })
  }

  if (props.neuroglancerDatas && props.neuroglancerDatas.layers && props.neuroglancerDatas.layers.length > 0) {
    props.neuroglancerDatas.layers.forEach((nl) => {
      const renderInfo = {
        ...nl,
        type: "neuroglancer",
        show: ref(nl?.visible === false? false : true)
      }
      renderInfo.label = nl.name;
      renderInfo.neuroType = nl.type;
      renderInfo.name = nl.name;
      renderDatas.value[renderInfo.name] = renderInfo;

      if (nl.type === "segmentation"){
        const { getFocusRegion } = useAtlasStore();
        layerFocusHandler.value[nl.name] = getFocusRegion;
      }
      let shader = ""
      if (nl.type === "image" && nl.shaderControls && nl.shaderControls.color){
        shader = getImageLayerShader("","","",nl.shaderControls.color,"emitRGB" )
        Layers.value.push({...nl, shader: shader})
      } else {
        Layers.value.push(nl)
      }

    })
  }

  const updateState = (newState) => {
    const currentStateJ = neuroRef.value.getViewerState().toJSON();
    state.value = {
      ...currentStateJ,
      ...newState
    }
  }

  const setLayerVisible = (layers, visible) => {
    layers.forEach(name => {
      const managedLayer = neuroRef.value.getManagedLayer(name);
      managedLayer.setVisible(visible);
    })
  } 

  onMounted(async () => {
    if(Layers.value.length) {
      updateState({...props.neuroglancerDatas, layers: Layers.value})
    }
  })

  return {
    neuroRef,
    state,
    renderDatas,
    atlasInfo,
    updateState,
    setLayerVisible,
    layerFocusHandler,
  }
}