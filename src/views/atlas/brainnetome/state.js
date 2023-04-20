export default {
  "dimensions": {
    "x": [
      1e-9,
      "m"
    ],
    "y": [
      1e-9,
      "m"
    ],
    "z": [
      1e-9,
      "m"
    ]
  },
  "position": [
    0.5,
    0.5,
    3.5
  ],
  "crossSectionScale": 1,
  "projectionOrientation": [
    -0.539131760597229,
    0.5417973399162292,
    -0.45929670333862305,
    0.45259156823158264
  ],
  "projectionScale": 220,
  "layers": [
    {
      "type": "segmentation",
      "source": `precomputed://http://${window.location.host}/atlas_data/bn_atlas/`,
      "tab": "segments",
      "name": "brainnetome",
    },
    {
      "type": "segmentation",
      "source": `precomputed://http://${window.location.host}/atlas_data/bn_atlas_whole`,
      "tab": "rendering",
      "meshSilhouetteRendering": 5,
      "segments": [
        "275"
      ],
      "segmentDefaultColor": "#ffffff",
      "name": "brainnetome_whole"
    }
  ],
  "showAxisLines": false,
  "showScaleBar": false,
  "showDefaultAnnotations": false,
  "showSlices": false,
  "selectedLayer": {
    "visible": true,
    "layer": "brainneto"
  },
  "layout": "3d"
}