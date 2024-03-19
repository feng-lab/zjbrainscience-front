import { LayerHandler, registerLayerHandler } from "./base";

class AnnotationLayerHandler extends LayerHandler{
  constructor(data, rootPath, subpage) {
    super(data, rootPath, subpage);
    this.type = "annotation";
  }
  parseData() {
    super.parseData((layer) => {
      const { shader="" } = this.data;
      layer.shader = shader;
      return [layer];
    })
  }
}

registerLayerHandler("annotation", AnnotationLayerHandler);