import { onMounted, ref } from "vue";

export function useBigBrainLayer(neuroRef, baseUrl, atlasProps) {
  const name = `${atlasProps.name}_bigbrain`;
  let transform = {};
  let shader = "";
  if(atlasProps?.plugins?.bigBrain?.metaData){
    transform = atlasProps.plugins.bigBrain.metaData?.transform ?? transform;
    shader = atlasProps.plugins.bigBrain.metaData?.shader ?? shader;
  }
  const layer = [{
    "type": "image",
    name,
    "source": {
      "url": `precomputed://${baseUrl}/${name}`,
      transform,
    },
    visible: false,
    "tab": "source",
    shader
  }]
  const layerSetting = {
    label: "BigBrain",
    key: name,
    layers: [name]
  }

  const setNormalizedRange = (range) => {
    const bigBrainLayer = neuroRef.value.getManagedLayer(name).layer;
    const toNormalizedControl = bigBrainLayer.shaderControlState.value.get("toNormalized");
    toNormalizedControl.trackable.value.range = range;
    toNormalizedControl.trackable.changed.dispatch();
  }

  return {
    layer,
    layerSetting,
    setNormalizedRange
  }
}

