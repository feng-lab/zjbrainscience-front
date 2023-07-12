import { onMounted, ref } from "vue";
export function useAtlas() {
  const neuroRef = ref();
  const renderLayers = {};
  const segmentLayer = null;
  const state = ref({
    "showAxisLines": true,
    "showScaleBar": false,
    "showDefaultAnnotations": false,
    "layout": "4panel",
    "crossSectionBackgroundColor": "#262626",
    "layers" : [],
  })
  const addLayer = (layer, layerSetting) => {
    state.value.layers = [
      ...state.value.layers,
      ...layer
    ];
    renderLayers[layerSetting.key] = layerSetting;
  }

  const setLayerVisible = (layers, visible) => {
    layers.forEach(name => {
      const managedLayer = neuroRef.value.getManagedLayer(name);
      managedLayer.setVisible(visible);
    })
  } 


  return {
    neuroRef,
    state,
    renderLayers,
    addLayer,
    setLayerVisible
  }
}