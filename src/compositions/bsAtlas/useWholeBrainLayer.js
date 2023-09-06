import { useBsAtlasBaseUrl } from "./useBsAtlas";
import { useSegmentationLayer } from "./useSegmentationLayer";

//export async function useWholeBrainLayer(atlasName, wholeSegmentId="", options={}) {
export function useWholeBrainLayer(atlasName, wholeSegmentId="", options={}) {
  const { baseUrl } = useBsAtlasBaseUrl(atlasName);
  //const { layers } = await useSegmentationLayer(
  const { layers } = useSegmentationLayer(
    baseUrl, atlasName, { name: "whole", options, label: "Whole Brain Silhouette"});

  layers[0] = {
    ...layers[0],
    segments: [wholeSegmentId],
    meshSilhouetteRendering: 5,
    segmentDefaultColor: "#ffffff",
    disableResponseDblclick0Event: true,
  }


  return {
    layers
  }

}