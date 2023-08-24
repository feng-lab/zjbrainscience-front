export const wholeBrainProps = {
  wholeSegmentId: String,
}

export function useWholeBrainLayer(baseUrl, atlasProps) {
  const name = `${atlasProps.name}_whole`;
  const layer = [{
    "type": "segmentation", 
    "source": `precomputed://${baseUrl}/${name}`, 
    "tab": "segments", 
    name,
    "disableResponseDblclick0Event": true,
    "segments": [atlasProps.wholeSegmentId],
    "meshSilhouetteRendering": 5,
    "segmentDefaultColor": "#ffffff",
  }]
  const layerSetting = {
    label: "Whole Brain Silhouette",
    key: name,
    layers: [name],
    defaultShow: true
  }

  return {
    layer,
    layerSetting
  }

}

