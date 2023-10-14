export function useAnnotationLayer(baseUrl, atlasName, layerInfo) {
  const { name: layerName, options, label } = layerInfo;
  const name = `${atlasName}_${layerName}`;
  return {
    layers: [{
      name,
      label,
      type: "annotation",
      source: `precomputed://${baseUrl}/${name}`,
      ...options
    }]
  }
}
