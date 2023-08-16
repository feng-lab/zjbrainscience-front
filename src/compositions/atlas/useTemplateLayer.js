import { onMounted, ref } from "vue";

export function useTemplateLayer(neuroRef, baseUrl, atlas_name,  templateProp) {
  const name = `${atlas_name}_template`;
  let shader = templateProp?.shader ?? "";
  const layer = [{
    "type": "image",
    name,
    "source": `precomputed://${baseUrl}/${name}`,
    visible: true,
    "tab": "source",
    shader
  }]
  const layerSetting = {
    label: "Template",
    key: name,
    layers: [name],
    defaultShow: true
  }

  return {
    layer,
    layerSetting,
  }
}

