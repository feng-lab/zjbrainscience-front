import axios from "axios";
import { useBsAtlasBaseUrl } from "./useBsAtlas";

const channelColorMap = {
  "red": "vec3(1.0, 0.0, 0.0)",
  "green": "vec3(0.0, 1.0, 0.0)",
  "blue": "vec3(0.0, 0.0, 1.0)"
}

export function getImageLayerShader(
  dtype = "uint16_t", 
  customMainShader = "",
  transCondition = "", 
  defaultColor = "white", 
  colorMap = "emitGrayscale"
){
  let colorShader = ""
  if (colorMap === "emitGrayscale") {
    colorShader = transCondition ? `
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
  } else if (colorMap === "emitRGB") {
    return `
      #uicontrol invlerp normalized
      #uicontrol vec3 color color(default="${defaultColor}")
      #uicontrol float brightness slider(default=0, min=-1, max=1, step=0.1)
      #uicontrol float contrast slider(default=0, min=-3, max=3, step=0.1)
      
      void main() {
        emitRGB(
          color * vec3(normalized() + brightness) * exp(contrast));
      }

  `
  } else {
    return `
      #uicontrol invlerp normalized
      #uicontrol vec3 color color(default="${defaultColor}")
      #uicontrol float brightness slider(default=0, min=-1, max=1, step=0.1)
      #uicontrol float contrast slider(default=0, min=-3, max=3, step=0.1)
      
      void main() {
        emitRGB(
          color * vec3(normalized() + brightness) * exp(contrast));
      }

  `
  }


}

//export async function useBsImage(imageInfo, atlasName) {
export function useBsImage(imageInfo, atlasName) {
  const { baseUrl } = useBsAtlasBaseUrl(atlasName);
  const { name, label, channels=[], dataType, transCondition, customMainShader, colorMap, defaultColor, options={}} = imageInfo;
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
        // url: `precomputed://${baseUrl}/${atlasName}_${name}`,
        url: `precomputed://https://eeum-brain.com/static/neuroglancer_data/181005_Lemur-Hotsauce_SMI99_VGluT2_NeuN/${label}`,
        transform,
      },
      shader: getImageLayerShader(
        dataType, customMainShader, transCondition, defaultColor, colorMap),
      ...otherOptions,
      //...imageOptions
    })
  }

  return {
    layers
  }


}