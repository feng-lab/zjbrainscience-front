export const connectivityProps = {
  connectivityEdges: Object,
  connectivityEndpoints: Object,
}

const getConnectivityLayer = (prefix, linkSegmentLayer, connectivity, sourcePath) => {
  return [{
    "type": "annotation",
    "source": `${sourcePath}/${prefix}/edges`, 
    "visible": false,
    "tab": "annotations",
    "linkedSegmentationLayer": {
      "segment": linkSegmentLayer
    },
    "filterBySegmentation": [ "segment" ],
    "name": `${connectivity}_edges_${prefix}`,
    "shader": "\nvoid main() {\n  setColor(defaultColor());\n  setEndpointMarkerSize(0.0);\n}\n",
  }, {
    "type": "annotation",
    "source": `${sourcePath}/${prefix}/endpoints`, 
    "visible": false,
    "tab": "annotations",
    "linkedSegmentationLayer": {
      "segment": linkSegmentLayer
    },
    "filterBySegmentation": [ "segment" ],
    "name": `${connectivity}_endpoints_${prefix}`,
  }]
}

export function useConnectivityLayer(baseUrl, atlasProps, linkSegmentLayer) {
  const connectivity = `${atlasProps.name}_connectivity`;
  let layer = [];
  if(atlasProps.plugins.connectivity === "lr") {
    ["left", "right"].forEach(side => {
      layer = [
        ...layer,
        ...getConnectivityLayer(
          side, 
          linkSegmentLayer, 
          connectivity, 
          `precomputed://${baseUrl}/${connectivity}`, 
        )
      ]
    })
  } else {
    layer = [
      ...layer,
      ...getConnectivityLayer(
        "", 
        linkSegmentLayer, 
        connectivity, 
        `precomputed://${baseUrl}/${connectivity}`
      )
    ]
  }
  const layerSetting = {
    key: `${atlasProps.plugins.connectivity}_${connectivity}`,
    label: "Connectivity",
    layers: layer.map(l => l.name)
  }

  return {
    layer,
    layerSetting
  }
}

