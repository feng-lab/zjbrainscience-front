import { LayerHandler, registerLayerHandler } from "./base";

class SegmentationLayerHandler extends LayerHandler{
  constructor(data, rootPath, subpage) {
    super(data, rootPath, subpage);
    this.type = "segmentation";
  }
}

class RegionLayerHandler extends SegmentationLayerHandler {
  constructor(data, rootPath, subpage) {
    super(data, rootPath, subpage);
  }
  parseData() {
    return super.parseData((layer) => {
      layer.label = "Brain Regions";
      return [layer];
    })
  }
}

class WholeBrainLayerHandler extends SegmentationLayerHandler {
  constructor(data, rootPath, subpage) {
    super(data, rootPath, subpage);
  }
  parseData() {
    return super.parseData((layer) => {
      layer = {
        ...layer,
        label: "Whole Brain Silhouette",
        meshSilhouetteRendering: 5,
        segmentDefaultColor: "#ffffff",
        disableResponseDblclick0Event: true,
      }
      return [layer];
    })
  }

}

registerLayerHandler("segmentation", SegmentationLayerHandler);
registerLayerHandler("regions", RegionLayerHandler);
registerLayerHandler("wholeBrain", WholeBrainLayerHandler);