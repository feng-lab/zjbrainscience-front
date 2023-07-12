import { onMounted, ref } from "vue";
const validateDefaultVisible = (value) => {
  return typeof value === "string" ? value === "all" : true
}
export const segmentProps = {
  treeData: {
    type:Array,
    default: [],
    required: true
  },
  segmentsColors: Object,
  defaultVisible: {
    type: [Array, String],
    default: [],
    validator: validateDefaultVisible
  },
  removeOctant: {
    type:Boolean,
    default: false 
  }
}

export function useSegmentLayer(neuroRef, baseUrl, atlasProps) {
  const treeRef = ref();
  let segmentationLayer = ref();
  const name = `${atlasProps.name}_segments`;
  const layer = [{
    "type": "segmentation", 
    "source": `precomputed://${baseUrl}/${name}`, 
    "tab": "segments", 
    name,
    "removeOctant": atlasProps.removeOctant,
    "segmentColors": atlasProps.segmentsColors
  }]
  const layerSetting = {
    label: "Mesh",
    key: name,
    layers: [name],
    defaultShow: true
  };

  onMounted(() => {
    segmentationLayer.value = neuroRef.value.getManagedLayer(name);
  })

  const setMeshLayerAlpha = (alpha) => {
    console.log(segmentationLayer.value, alpha)
    segmentationLayer.value.layer.displayState.selectedAlpha.value = alpha;
  }


  return {
    treeRef,
    name,
    layerSetting,
    layer,
    segmentationLayer,
    setMeshLayerAlpha
  }

}