import { getAtlasInfo, getAtlasByPage } from "@/api/atlas";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useBrainRegionsLayer } from "../bsAtlas/useBrainRegionsLayer";
import { useWholeBrainLayer } from "../bsAtlas/useWholeBrainLayer";
import { useSegmentationLayer } from "../bsAtlas/useSegmentationLayer";
import { useConnectivityLayer } from "../bsAtlas/useConnectivityLayer";
import { useBsImage } from "../bsAtlas/useBsImage";
import { useRouter } from "vue-router";
import { useAnnotationLayer } from "../bsAtlas/useAnnotationLayer";

import { atlasDetailApi } from "../../views/visualization/testApi";

export function useBsAtlasBaseUrl(atlasName) {
  return {
    baseUrl: `http://${window.location.host}/atlas_data/${atlasName}`
  }
}

export function useBsAtlasList() {
  const atlasList = ref([]);
  const router = useRouter();

  const handleViewAtlas = (atlas) => {
    router.push(`/atlas/display/${atlas}`);
  }

  onMounted(async () => {
    const { count, items } = await getAtlasByPage();
    atlasList.value = items;
  })

  return {
    atlasList,
    handleViewAtlas
  }

}

export function useAtlas(props) {
  const neuroRef = ref();
  const atlas = ref({})

  const state = ref({
    showAxisLines: true,
    showDefaultAnnotations: false,
    sliceViewCrossSectionBgColor: "#141414",
    crossSectionBackgroundColor: "#364d79",
    crossSectionBackgroundAlpha: 0.2,
    layers: []
  });

  const layerFocusHandler = ref({});
  const renderDatas = ref({});




  //if(props?.chartDatas) {
  //  props?.chartDatas.forEach(l => {
  //    renderDatas.value[l.name] = {
  //      ...l,
  //      type: "chart",
  //      show: ref(!l.defaultHidden)
  //    }
  //  })
  //}


  //const getAtlasLayers = async (baseUrl) => {
  //  const { name:atlasName, whole_segment_id } = atlas.value;

  //  let atlasLayers = [];
  //  props.neuroglancerDatas.forEach((nl, index) => {
  //    const renderInfo = {
  //      ...nl,
  //      type: "neuroglancer",
  //      show: ref(nl?.connectivityType === "lr" ? 0 : !nl.defaultHidden)
  //    }

  //    let layers;
  //    renderInfo.name = nl?.name ? `${atlasName}_${nl.name}` : "";
  //    const { options={} } = nl;

  //    switch(nl.type) {
  //      case "regions":
  //        layers = useBrainRegionsLayer(atlasName, options, layerFocusHandler);
  //        break;
  //      case "wholeBrain":
  //        layers = useWholeBrainLayer(atlasName, whole_segment_id, options);
  //        break;
  //      case "connectivity":
  //        renderInfo.name = `${atlasName}_connectivity`;
  //        layers = useConnectivityLayer(baseUrl, atlasName, nl, layerFocusHandler);
  //        break;
  //      case "image": 
  //        layers = useBsImage(nl, atlasName);
  //        break;
  //      case "segmentation":
  //        layers = useSegmentationLayer(baseUrl, atlasName, nl);
  //        break;
  //      case "annotation": 
  //        layers = useAnnotationLayer(baseUrl, atlasName, nl);
  //        break;
  //    }
  //    layers = layers.layers;

  //    renderInfo.label = layers[0].label;
  //    renderInfo.neuroType = layers[0].type;

  //    if(layers.length > 1) {
  //      renderInfo.subLayer = layers.map(l => l.name);
  //      atlasLayers = [
  //        ...atlasLayers,
  //        ...layers.map(l => ({ ...l, visible: !nl.defaultHidden}))
  //      ]
  //    } else {
  //      renderInfo.name = layers[0].name;
  //      atlasLayers.push({
  //        ...layers[0],
  //        visible: !nl.defaultHidden
  //      })
  //    }
  //    renderDatas.value[renderInfo.name] = renderInfo;
  //    axios.get(`${baseUrl}/${renderInfo.name}/state.json`)
  //    .then(res => {
  //      const { data } = res;
  //      const layer = state.value.layers[index];
  //      state.value.layers[index] = {
  //        ...layer,
  //        ...data
  //      }
  //    })
  //    .catch(e => {
  //    })
  //  })
  //  return atlasLayers;
  //}

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
    atlas.value = await atlasDetailApi(Number(props.atlasId));
    const { name: atlasName } = atlas.value;
    //const { baseUrl } = useBsAtlasBaseUrl(atlasName);
    //const { data: atlasState } = await axios.get(`${baseUrl}/state.json`)
    //                              .catch(e => { return { data: {} }});
    //const layers = await getAtlasLayers(baseUrl);
    //if(layers.length) {
    //  updateState({
    //    ...atlasState,
    //    layers
    //  })
    //}
  })


  return {
    neuroRef,
    state,
    renderDatas,
    atlas,
    updateState,
    setLayerVisible,
    layerFocusHandler,
  }
}