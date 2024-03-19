import { onMounted, ref, watch } from "vue";
import { getAtlasRegionTrees } from '@/api/atlas';
import {eeum_region} from '@/locals/eeum_region'

export function useRegionsLabelTree(neuroRef, atlasInfo, atlasId, showLabelTree) {
  const treeRef = ref();
  const regionsLabelTree = ref([]);
  const filterText = ref("");

  const checkTreeNode = () => {
    const ids = treeRef.value.getCheckedNodes(false, false)
                            .filter(node => Number(node.region_id))
                            .map(node => node.region_id);
    const regionLayerName = `${atlasInfo.value.name}`;                  
    neuroRef.value.setVisibleSegments("Atlas", ids);
  }

  const filterTreeNode = (value, data) => {
    if(!value) return true;
    return data.label?.includes(value) || String(data.region_id).includes(value);
  }

  onMounted(async ()=> {
    if(showLabelTree) {
      if (atlasId === 4) {
        regionsLabelTree.value = eeum_region;
      } else {
        regionsLabelTree.value = await getAtlasRegionTrees(atlasId); // label tree
      }
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