import axios from "axios";

//export async function useSegmentationLayer(baseUrl, atlasName, layerInfo) {
export function useSegmentationLayer(baseUrl, atlasName, layerInfo) {
  const { name, options, label } = layerInfo;
  const layerName = `${atlasName}_${name}`

  //const { data: layerOption } = await axios.get(`${baseUrl}/${layerName}/state.json`)
  //                                .catch(e => { return { data: {}} });
  const layer = {
    name: layerName,
    label,
    type: "segmentation",
    source: `precomputed://https://eeum-brain.com/static/neuroglancer_data/Atlas/annotation/`,
    // source: `precomputed://${baseUrl}/${layerName}`,
    ...options,
    //...layerOption
  }
  console.log('layer', layer)

  return {
    layers: [layer]
  }
}