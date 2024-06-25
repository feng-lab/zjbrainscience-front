<template>
  <el-row :gutter="8" class="multiple-line-row">
    <el-col :xs="24" :sm="16" :md="20" id="graph-tree-wrap">
      <div id="graph-tree" />
    </el-col>
    <el-col :xs="24" :sm="8" :md="4" v-show="showDatasets">
      <p>最新更新数据</p>
      <el-scrollbar
        max-height="calc(90vh - 100px)"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <ul class="datasets-list" v-if="datasetList.length">
          <li
            class="datasets-item"
            v-for="(item, index) in datasetList"
            :key="index"
            @click="getDatasetDetail(item.id)"
          >
            <div class="name">
              {{ item.name }}
            </div>
            <div class="label">
              <el-tag type="success" class="tag">{{ item.type }}</el-tag>
              <el-tag type="primary" class="tag">{{ item.period }}</el-tag>
            </div>
            <div class="desc">{{ item.desc }}</div>
            <div class="date">{{ item.date }}</div>
          </li>
        </ul>
        <ul v-else>
          <el-empty />
        </ul>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import G6 from '@antv/g6'
import { useRouter } from 'vue-router'
import { allExByPageApi } from '@/api/datasetManagement'

const router = useRouter()
const graphData = {
  id: 'Eukaryota',
  children: [
    {
      id: 'Metazoa',
      children: [
        {
          id: 'Drosophila melanogaster',
          children: [],
        },
        {
          id: 'Chordata',
          children: [
            {
              id: 'Petromyzon marinus',
              children: [],
            },
            {
              id: 'Danio rerio',
              children: [],
            },
            {
              id: 'Pelodiscus sinensis',
              children: [],
            },
            {
              id: 'Amphibia',
              children: [
                { id: 'Paramesotriton chinensis', children: [] },
                { id: 'Xenopus tropicalis', children: [] },
              ],
            },
            {
              id: 'Aves',
              children: [
                { id: 'Columba', children: [] },
                { id: 'Taeniopygia guttata', children: [] },
                { id: 'Gallus gallus', children: [] },
              ],
            },
            {
              id: 'Mammalia',
              children: [
                { id: 'Sus scrofa', children: [] },
                {
                  id: 'Muridae',
                  children: [
                    { id: 'Mus musculus', children: [] },
                    { id: 'Rattus norvegicus', children: [] },
                  ],
                },
                {
                  id: 'Primates',
                  children: [
                    { id: 'Microcebus murinus', children: [] },
                    { id: 'Callithrix jacchus', children: [] },
                    {
                      id: 'Hominidae',
                      children: [
                        { id: 'Homo sapiens', children: [] },
                        { id: 'Pan troglodytes', children: [] },
                        { id: 'Gorilla gorilla', children: [] },
                      ],
                    },
                    {
                      id: 'Macaca',
                      children: [
                        { id: 'Macaca mulatta', children: [] },
                        { id: 'Macaca fascicularis', children: [] },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'Magnoliopsida',
      children: [
        {
          id: 'Poaceae',
          children: [
            { id: 'Zea mays', children: [] },
            { id: 'Oryza sativa', children: [] },
          ],
        },
        { id: 'Glycine max', children: [] },
        { id: 'Arabidopsis thaliana', children: [] },
      ],
    },
  ],
}

const datasetList = ref([
  // {
  //   name: '数据集1',
  //   desc: '数据集简介1数据集简介1数据集简介1数据集简介1数据集简介1数据集简介1',
  //   type: '转录组',
  //   period: '胚胎',
  //   date: '2019-09-12 19:58:01',
  // },
])
const lastChildList = ref([])
const showDatasets = ref(false)
const loading = ref(false)

onMounted(() => {
  getLastChildLists(graphData)
  drawGraph()
})

const getLastChildLists = (data) => {
  if (data.children && data.children.length) {
    data.children.forEach((item) => {
      if (item.children && item.children.length) {
        getLastChildLists(item)
      } else {
        lastChildList.value.push(item.id)
      }
    })
  }
}

const getSpeciesDatasets = async (id) => {
  try {
    loading.value = true
    const res = await allExByPageApi({
      species: id,
      offset: 0,
      limit: 10000,
    })
    datasetList.value = res.items
      ? res.items.map((one) => ({
          name: one.data_publisher || '--',
          desc: one.description || '--',
          type: one.data_type || '',
          period: one.development_stage === '无' ? '' : one.development_stage,
          date: one.data_update_year || '--',
          id: one.id || '',
        }))
      : []
    loading.value = false
    showDatasets.value = lastChildList.value.includes(id)
  } catch (err) {
    loading.value = false
    console.log(err)
  }
}

const drawGraph = () => {
  let treeWrap = document.getElementById('graph-tree-wrap')
  const graph = new G6.TreeGraph({
    container: 'graph-tree',
    width: treeWrap.offsetWidth,
    height: treeWrap.offsetHeight,
    pixelRatio: 2,
    linkCenter: true,
    animate: true,
    animateCfg: {
      duration: 200,
      easing: 'easeLinear',
      delay: 50,
    },
    modes: {
      default: [
        'drag-canvas',
        {
          type: 'collapse-expand',
          trigger: 'click',
          sensitivity: 1,
          // relayout: false,
          // onChange: function onChange(item, collapsed) {
          //   const data = item.get("model");
          //   data.collapsed = collapsed;
          //   return true;
          // },
        },
        {
          type: 'zoom-canvas',
          sensitivity: 2,
        },
      ],
      edit: ['click-select'],
    },
    layout: {
      type: 'dendrogram',
      direction: 'LR', // H / V / LR / RL / TB / BT
      nodeSep: 50,
      rankSep: 100,
      radial: true,
      excludeInvisibles: true,
    },
    defaultNode: {
      size: 28,
      style: {
        fill: '#40a9ff',
        stroke: '#096dd9',
      },
      icon: {
        /* whether show the icon, false by default */
        show: false,
        /* icon's img address, string type */
        // img: 'https://gw.alipayobjects.com/zos/basement_prod/012bcf4f-423b-4922-8c24-32a89f8c41ce.svg',
        /* icon's size, 20 * 20 by default: */
        //   width: 40,
        //   height: 40
      },
      labelCfg: {
        /* label's position, options: center, top, bottom, left, right */
        position: 'center',
        /* label's offset to the keyShape, 4 by default */
        //   offset: 12,
        /* label's style */
        style: {
          fontSize: 14,
          // fill: '#00ff00',
          fontWeight: 500,
        },
      },
    },
    defaultEdge: {
      style: {
        stroke: '#A3B1BF',
      },
    },
  })

  graph.node(function (node) {
    return {
      size: 45,
      style: {
        fill: '#52c41a',
        stroke: '#52c41a',
      },
      label: node.id,
    }
  })
  // 读取数据
  graph.data(graphData)
  // 渲染图
  graph.render()
  graph.fitView()
  graph.on('node:mouseenter', (evt) => {
    const { item } = evt
    graph.setItemState(item, 'active', true)
  })

  graph.on('node:mouseleave', (evt) => {
    const { item } = evt
    graph.setItemState(item, 'active', false)
  })

  graph.on('node:click', (evt) => {
    const { item } = evt
    graph.setItemState(item, 'selected', true)
    getSpeciesDatasets(item._cfg.id)
    // console.log('node click--->', evt, lastChildList.value)
  })
  graph.on('canvas:click', (evt) => {
    graph.getNodes().forEach((node) => {
      graph.clearItemStates(node)
    })
  })
}

const getDatasetDetail = (id = 1) => {
  router.push(`experiments/detail/${id}/info`)
}
</script>

<style lang="scss" scoped>
#graph-tree {
  height: calc(100vh - 160px);
  width: 100%;
}
p {
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  color: #323233;
  margin: 16px 0;
}
.datasets-list {
  padding-left: 0;
  // max-height: 82vh;
  // overflow-y: scroll;
  .datasets-item {
    padding: 16px 0;
    border-bottom: 1px solid #ddd;
    list-style: none;
    margin-right: 10px;
    cursor: pointer;
    .name {
      font-size: 16px;
      line-height: 20px;
      color: #323233;
    }
    .label {
      margin: 5px 0;
      :deep(.el-tag.el-tag--primary) {
        --el-tag-text-color: #4096ff;
        --el-tag-bg-color: #e6f4ff;
      }
      .tag {
        margin-right: 10px;
      }
    }
    .desc {
      font-size: 14px;
      line-height: 20px;
      color: #646566;
      margin-bottom: 12px;
    }
    .date {
      font-size: 14px;
      line-height: 20px;
      color: #969799;
    }
  }
}
</style>
