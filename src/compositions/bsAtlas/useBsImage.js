import axios from "axios";
import { useBsAtlasBaseUrl } from "./useBsAtlas";

const channelColorMap = {
  "red": "vec3(1.0, 0.0, 0.0)",
  "green": "vec3(0.0, 1.0, 0.0)",
  "blue": "vec3(0.0, 0.0, 1.0)"
}

const getImageLayerShader = (
  dtype, 
  customMainShader="",
  transCondition, 
  defaultColor="", 
  colorMap="emitGrayscale"
) => {
  let colorShader = transCondition ? `
    if( ${transCondition} ) {
      emitTransparent();
    } else {
      ${colorMap}(${defaultColor} toNormalized(x));
    }
  ` : `${colorMap}(toNormalized(x));`;

  return `
    #uicontrol invlerp toNormalized
    void main() {
      ${dtype} x = getDataValue();
      ${colorShader}
      ${customMainShader}
    }

  `

}

//export async function useBsImage(imageInfo, atlasName) {
export function useBsImage(imageInfo, atlasName) {
  const { baseUrl } = useBsAtlasBaseUrl(atlasName);
  const { name, label, channels=[], dataType, transCondition="", customMainShader="", options={}} = imageInfo;
  const { transform={}, ...otherOptions } = options;

  //const { data: imageOptions } = await axios.get(`${baseUrl}/${atlasName}_${name}/state.json`)
  //                                .catch(e => { return { data: {}} });
  const layers = [];
  if(channels.length > 1) {
    channels.forEach(c => {
      layers.push({
        type: "image",
        label,
        name: `${atlasName}_${name}_${c}`,
        source: {
          url: `precomputed://${baseUrl}/${atlasName}_${name}/${atlasName}_${name}_${c}`,
          transform
        },
        blend: "additive",
        shader: getImageLayerShader(
          dataType, customMainShader, transCondition, `${channelColorMap[c]} * `, "emitRGB"),
        ...otherOptions,
        //...imageOptions
      })
    })
  } else {
    layers.push({
      type: "image",
      label,
      name: `${atlasName}_${name}`,
      source: {
        url: `precomputed://${baseUrl}/${atlasName}_${name}`,
        transform,
      },
      shader: getImageLayerShader(
        dataType, customMainShader, transCondition),
      ...otherOptions,
      //...imageOptions
    })
  }

  return {
    layers
  }


}