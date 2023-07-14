import { onMounted, ref } from "vue";
export function useAtlas() {
  const neuroRef = ref();
  const renderLayers = {};
  const segmentLayer = null;
  const state = ref({
    "showAxisLines": true,
    "showScaleBar": false,
    "showDefaultAnnotations": false,
    "layout": "3sliceB",
    "sliceViewCrossSectionBgColor": "#111a2c",
    "sliceViewCrossSectionBgAlpha": 0.7,
    //"crossSectionBackgroundColor": "#262626",
    "crossSectionBackgroundColor": "#15325b",
    "crossSectionBackgroundAlpha": 0.1,
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

  const supportPlugins = ["fc", "sc", "bdf", "pcf"];


  return {
    neuroRef,
    state,
    renderLayers,
    addLayer,
    setLayerVisible,
    supportPlugins
  }
}