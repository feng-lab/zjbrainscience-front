import { LayerHandler, registerLayerHandler } from "./base";

class ImageLayerHandler extends LayerHandler {
  channelColors = [
    "vec3(1.0, 0.0, 0.0)",
    "vec3(0.0, 1.0, 0.0)",
    "vec3(0.0, 0.0, 1.0)"
  ]

  constructor(data, rootPath, subpage) {
    super(data, rootPath, subpage);
    this.type = "image";
  }

  parseData() {
    const { options, shader="" } = this.data;
    const { numChannels=1 } = options;

    const basicLayer = {
      ...super.parseData()[0],
      shader
    }

    if(numChannels === 1) {
      return [basicLayer];
    }

    let layers = [];
    for(let i=0; i < numChannels.length;i++) {
      const color = this.channelColors[i];
      layers.push({
        ...basicLayer,
        shader: `
        #uicontrol invlerp normalized
        void main() {  
          emitRGB(${color} * normalized());
        }`,
        blend: "additive",
        source: `${basicLayer}/channel${i}`
      })

    }
    return layers;
  }
}

registerLayerHandler("image", ImageLayerHandler);