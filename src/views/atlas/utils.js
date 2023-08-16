export const treeToIndices = (trees) => {
  let indicesObj = {};
  for(let node of trees ) {
    const { id, children=[], ...prop } = node;
    id && (indicesObj[id] = prop);
    if(children.length) {
      Object.assign(indicesObj, treeToIndices(children))
    }
  }
  return indicesObj;
}