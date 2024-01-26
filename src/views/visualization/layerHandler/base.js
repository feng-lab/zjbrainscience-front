export class LayerHandler {
  type;

  constructor(data, rootPath, subpage) {
    this.data = data;
    this.rootPath = rootPath;
    this.subpage = subpage;
  }

  parseData(callback) {
    console.log('data', this.data)
    const { name, label, options={}, path=undefined, url=undefined } = this.data;
    const layer = {
      name, 
      label,
      type: this.type,
      ...options
    }
    const exitPath = url ?? path; 
    layer.source = exitPath ? exitPath : `precomputed://${this.rootPath}/${this.subpage}/${name}`;
    return  callback ? callback(layer) : [layer];
  }
}

const layerHanlers = new Map();

export const registerLayerHandler = (type, handler) => {
  if(type && handler) {
    layerHanlers.set(type, handler)
  }
}

export const getLayerHandler = (type) => {
  return layerHanlers.get(type);
}