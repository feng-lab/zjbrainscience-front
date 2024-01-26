import { onMounted, ref, watch } from "vue";
import { getAtlasRegionTrees } from '@/api/atlas';

export function useRegionsLabelTree(neuroRef, atlasInfo, atlasId, showLabelTree) {
  const treeRef = ref();
  const regionsLabelTree = ref([]);
  const filterText = ref("");

  const checkTreeNode = () => {
    const ids = treeRef.value.getCheckedNodes(false, false)
                            .filter(node => Number(node.region_id))
                            .map(node => node.region_id);
    const regionLayerName = `${atlasInfo.value.name}_regions`;                  
    console.log('region layer name', regionLayerName)
    neuroRef.value.setVisibleSegments(regionLayerName, ids);
  }

  const filterTreeNode = (value, data) => {
    if(!value) return true;
    return data.label?.includes(value) || String(data.region_id).includes(value);
  }

  onMounted(async ()=> {
    if(showLabelTree) {
      regionsLabelTree.value = await getAtlasRegionTrees(atlasId);
      console.log('region label tree', regionsLabelTree.value)
    }
  })

  watch(filterText, (value) => {
    treeRef.value.filter(value);
  })

  return {
    treeRef,
    regionsLabelTree,
    filterText,
    checkTreeNode,
    filterTreeNode
  }

}