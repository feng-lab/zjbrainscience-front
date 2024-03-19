
export const convetionList = [{
  id: 1,
  name: "Brain regions",
  description: "Visualize the brain regions based on the label info file and the mask roi images of regions",
  isMeta: false,
  outputExampleImg: "http://127.0.0.1/atlasd/platform_convertion/regions.png",
  targetType: "region",
  childrenSteps: [{
    id: 2,
    name: "Brain region's segmentation volumn",
    isMeta: true,
    handlerId: 1,
    sourceFormatDesc: "The roi mask file corresponding to each brain region needs to be named by the brain region id, such as 1.nii.gz or 1.obj",
    sourceType: "nifti, obj",
    targetType: "segmentation"
  }, {
    id: 3,
    name: "Brain Region's Labels",
    isMeta: true,
    sourceFormatDesc:"Support excel/csv files. Each line of the file contains the id, lobe, gyrus, hemisphere, descriptions, and position of the center of the brain region. The following figure is an input example and the first line in the figure does not be needed",
    inputExampleImg: "http://127.0.0.1/atlasd/platform_convertion/region_label_input.png",
    handlerId: 2,
    sourceType: "Excel/CSV",
    targetType: null
  }]
}, {
  id: 4,
  name: "whole_brain",
  description: "Visualize the entire brain outline",
  isMeta: true,
  outputExampleImg: "http://127.0.0.1/atlasd/platform_convertion/whole_brain.png",
  targetType: "wholeBrain",
  sourceType: "Nifti, obj"
}, {
  id: 5,
  name: "connectivity",
  description: "Visualize the connectivity between brain regions",
  outputExampleImg: "http://127.0.0.1/atlasd/platform_convertion/connectivity.png",
}, {
  id: 6,
  name: "image",
  description: "Visualize the image",
  outputExampleImg: "http://127.0.0.1/atlasd/platform_convertion/image.png",
}]
