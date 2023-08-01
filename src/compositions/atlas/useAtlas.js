import { ref, computed, watch } from "vue";
export function useAtlas(props) {
  const neuroRef = ref();
  const renderLayers = {};

  const segmentsLayout = ref(props?.atlasState?.layout ?? '3d');
  const scfcView = ref({});
  const segmentView = ref([]);
  const showRegion = ref();

  const addLayer = (layer, layerSetting) => {
    state.value.layers = [
      ...state.value.layers,
      ...layer
    ];
    renderLayers[layerSetting.key] = layerSetting;
    if(layerSetting.key.endsWith('_fc') || layerSetting.key.endsWith('_sc')) {
      layer.forEach(l => {
        scfcView.value[l.name] = !!l.visible;
      })
    } else {
      layer.forEach(l => {
        segmentView.value.push(l.name);
      })
    }
  }

  const setLayerVisible = (layers, visible) => {
    layers.forEach(name => {
      const managedLayer = neuroRef.value.getManagedLayer(name);
      managedLayer.setVisible(visible);
    })
  } 

  const getLayout = (scfcPanels) => {
    const children = []
    for(let [k, v] of Object.entries(scfcPanels)) {
      if(v) {
        const layers = [k];
        let groupLabel = `Functional Connectivity`;
        if(k.endsWith("_sc")) {
          layers.push(`${props.name}_whole`);
          groupLabel = "Structural Connectivity";
        }

        children.push({
          type: "viewer",
          layers,
          layout: "3d",
          flex:1,
          groupLabel,
          subGroupLabel: showRegion.value?.id ? `${showRegion.value.acronym}(ID: ${showRegion.value.id})` : ""
        })
      }
    }
    if(!children.length) {
      return segmentsLayout.value;
    }
    if(children.length === 1) {
      const notVisible = Object.entries(scfcView.value).filter(([k,v]) => !v)[0][0];
      children[0].layers.push(notVisible);
    }
    return {
      type: "row",
      children: [{
          type: "viewer",
          layers: segmentView.value,
          layout: segmentsLayout.value,
          flex: children.length > 1 ? 2 :1
        },
        {
          type: "column",
          children, 
          flex: 1
        }]
    }
  }


  const supportPlugins = ["fc", "sc", "bdf", "pcf"];

  const state = ref({
    "showAxisLines": true,
    "showScaleBar": false,
    "showDefaultAnnotations": false,
    "sliceViewCrossSectionBgColor": "#111a2c",
    "sliceViewCrossSectionBgAlpha": 0.7,
    //"crossSectionBackgroundColor": "#262626",
    "crossSectionBackgroundColor": "#15325b",
    "crossSectionBackgroundAlpha": 0.1,
    "layers" : [],
    ...props?.atlasState
  })

  let _projectionScale = null;
  let _crossSectionScale = null;

  watch([scfcView, segmentsLayout],  ([newScfc]) => {
    const newLayout = getLayout(newScfc);
    if(neuroRef.value) {
      const currentState = neuroRef.value.getViewerState();
      const currentStateJ = currentState.toJSON();
      if(!_projectionScale) {
        _projectionScale = currentStateJ.projectionScale;
      }
      if(!_crossSectionScale) {
        _crossSectionScale = currentStateJ.crossSectionScale;
      }
      const notGroupViewr = typeof newLayout === "string";
      const projectionScale = notGroupViewr ? _projectionScale: _projectionScale + 70;
      const crossSectionScale = notGroupViewr && newLayout.startsWith("3slice") ? _crossSectionScale + 0.2 : _crossSectionScale;
      const layers = currentStateJ.layers.map(x => {
        if(x.name.endsWith('_segments')) {
          return {
            ...x,
            removeOctant: notGroupViewr
          }
        } else {
          return x
        }
      })
      state.value = {
        ...currentStateJ,
        layers,
        crossSectionScale,
        projectionScale,
        layout: newLayout
      }

    }
  }, {
    deep: true
  })

  watch(showRegion, (newRegion, oldRegion)=> {
    if(newRegion?.id && newRegion?.id !== oldRegion?.id) {
      const currentStateJ = neuroRef.value.getViewerState().toJSON();
      const { layout } = currentStateJ;
      if(typeof layout === "object" ) {
        const childrenForScfc = layout.children[1];
        const scfcPanels = childrenForScfc.type === "viewer" ? [childrenForScfc] : childrenForScfc.children;
        const scfcPanelChildren = scfcPanels.map(x => ({ 
          ...x, 
          subGroupLabel: `${newRegion.acronym}(ID: ${newRegion.id})`
        }))
        if(childrenForScfc.type === "viewer") {
          layout.children[1] = scfcPanelChildren[0];
        } else {
          layout.children[1].children = scfcPanelChildren;
        }

        state.value = {
          ...currentStateJ,
          layout
        }
        
      }
    }
  })



  return {
    neuroRef,
    state,
    renderLayers,
    addLayer,
    setLayerVisible,
    supportPlugins,
    segmentsLayout,
    segmentView,
    scfcView,
    showRegion
  }
}