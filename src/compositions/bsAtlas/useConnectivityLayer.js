import useAtlasStore from "@/stores/atlas";

export const connectivityProps = {
  connectivityEdges: Object,
  connectivityEndpoints: Object,
}

const getConnectivityLayer = (prefix, linkSegmentLayer, connectivity, sourcePath, layerFocusHandler) => {
  const { getFocusRegion, getFocusConnectivity } = useAtlasStore();
  const label = "Connectivity";
  const edgeLayerName = `${connectivity}_edges_${prefix}`;
  const pointLayerName = `${connectivity}_endpoints_${prefix}`;

  layerFocusHandler.value[edgeLayerName] = getFocusConnectivity;
  layerFocusHandler.value[pointLayerName] = getFocusRegion;

  return [{
    "type": "annotation",
    "source": `${sourcePath}/${prefix}/edges`, 
    "visible": false,
    "tab": "annotations",
    "linkedSegmentationLayer": {
      "segment": linkSegmentLayer
    },
    "filterBySegmentation": [ "segment" ],
    "shader": "\nvoid main() {\n  setColor(defaultColor());\n  setEndpointMarkerSize(0.0);\n}\n",
    "name": edgeLayerName,
    label,
  }, {
    "type": "annotation",
    "source": `${sourcePath}/${prefix}/endpoints`, 
    "visible": false,
    "tab": "annotations",
    "linkedSegmentationLayer": {
      "segment": linkSegmentLayer
    },
    "filterBySegmentation": [ "segment" ],
    "name": pointLayerName,
    label,
  }]
}

export function useConnectivityLayer(baseUrl, atlasName, layerInfo, layerFocusHandler) {
  const connectivityParentDir = `${atlasName}_connectivity`;
  let layers = [];
  const { connectivityType } = layerInfo;
  const linkSegmentLayerName = `${atlasName}_regions`;

  if(connectivityType === "lr") {
    ["left", "right"].forEach(side => {
      layers = [
        ...layers,
        ...getConnectivityLayer(
                side, 
                linkSegmentLayerName, 
                connectivityParentDir, 
                `precomputed://${baseUrl}/${connectivityParentDir}`,
                layerFocusHandler)
      ]
    })
  } else {
    layers = getConnectivityLayer(
              "", 
              linkSegmentLayerName, 
              connectivityParentDir, 
              `precomputed://${baseUrl}/${connectivityParentDir}`,
              layerFocusHandler)
  }

  return {
    layers,
  }
}

