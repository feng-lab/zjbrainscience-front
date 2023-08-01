import { onMounted, ref } from "vue";

export function useFcLayer(baseUrl, atlasProps) {
  const name = `${atlasProps.name}_fc`;
  const layer = [{
    "type": "segmentation",
    name,
    "source": {
      "url": `precomputed://${baseUrl}/${name}`,
    },
    visible: false,
    "tab": "source"
  }]
  const layerSetting = {
    label: "Functional Connectivity(3D)",
    key: name,
    layers: [name],
    defaultShow: false
  }

  return {
    layer,
    layerSetting
  }
}

