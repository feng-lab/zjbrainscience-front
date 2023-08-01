import { onMounted, ref } from "vue";

export function useScLayer(baseUrl, atlasProps) {
  const name = `${atlasProps.name}_sc`;
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
    label: "Structural Connectivity(3D)",
    key: name,
    layers: [name],
    defaultShow: false
  }

  return {
    layer,
    layerSetting
  }
}

