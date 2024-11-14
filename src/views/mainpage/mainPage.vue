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
              <el-tag type="success" class="tag" v-if="item.type">{{
                item.type
              }}</el-tag>
              <el-tag type="primary" class="tag" v-if="item.period">{{
                item.period
              }}</el-tag>
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
  id: 'Eukaryota\n真核生物\n★', // 真核生物
  img: '../../../src/assets/img/species/tree/eukaryota.png',
  children: [
    {
      id: 'Metazoa\n后生动物', // 后生动物
      img: '../../../src/assets/img/species/tree/metazoa.png',
      children: [
        {
          id: 'Drosophila melanogaster\n果蝇', // 果蝇
          img: '../../../src/assets/img/species/tree/drosophilamelanogaster.png',
          children: [],
        },
        {
          id: 'Chordata\n脊索动物类', // 脊索动物类
          img: '../../../src/assets/img/species/tree/chordata.png',
          children: [
            {
              id: 'Petromyzon marinus\n七鳃鳗', // 七鳃鳗
              img: '../../../src/assets/img/species/tree/petromyzonmarinus.png',
              children: [],
            },
            {
              id: 'Danio rerio\n斑马鱼', // 斑马鱼
              img: '../../../src/assets/img/species/tree/daniorerio.png',
              children: [],
            },
            {
              id: 'Pelodiscus sinensis\n龟', // 龟
              img: '../../../src/assets/img/species/tree/pelodiscussinensis.png',
              children: [],
            },
            {
              id: 'Amphibia\n两栖类', // 两栖类
              img: '../../../src/assets/img/species/tree/amphibia.png',
              children: [
                {
                  id: 'Paramesotriton chinensis\n蝾螈',
                  img: '../../../src/assets/img/species/tree/paramesotritonchinensis.png',
                  children: [],
                }, // 蝾螈
                {
                  id: 'Xenopus tropicalis\n爪蟾',
                  img: '../../../src/assets/img/species/tree/xenopustropicalis.png',
                  children: [],
                }, // 爪蟾
              ],
            },
            {
              id: 'Aves\n鸟类', // 鸟类
              img: '../../../src/assets/img/species/tree/aves.png',
              children: [
                // { id: 'Columba', children: [] }, // 鸽子
                {
                  id: 'Aplopelia bonaparte\n鸽子',
                  img: '../../../src/assets/img/species/tree/aplopeliabonaparte.png',
                  children: [],
                }, // 鸽子
                {
                  id: 'Taeniopygia guttata\n斑马雀',
                  img: '../../../src/assets/img/species/tree/taeniopygiaguttata.png',
                  children: [],
                }, // 斑马雀
                {
                  id: 'Gallus gallus\n鸡',
                  img: '../../../src/assets/img/species/tree/gallusgallus.png',
                  children: [],
                }, // 鸡
              ],
            },
            {
              id: 'Mammalia\n哺乳动物', // 哺乳动物
              img: '../../../src/assets/img/species/tree/mammalia.png',
              children: [
                {
                  id: 'Sus scrofa\n猪',
                  img: '../../../src/assets/img/species/tree/susscrofa.png',
                  children: [],
                }, // 猪
                {
                  id: 'Muridae\n鼠科', // 鼠科
                  img: '../../../src/assets/img/species/tree/muridae.png',
                  children: [
                    {
                      id: 'Mus musculus\n小鼠',
                      img: '../../../src/assets/img/species/tree/musmusculus.png',
                      children: [],
                    }, // 小鼠
                    {
                      id: 'Rattus norvegicus\n鼠',
                      img: '../../../src/assets/img/species/tree/rattusnorvegicus.png',
                      children: [],
                    }, // 鼠
                  ],
                },
                {
                  id: 'Primates\n灵长类', // 灵长类
                  img: '../../../src/assets/img/species/tree/primates.png',
                  children: [
                    {
                      id: 'Microcebus murinus\n狐猴',
                      img: '../../../src/assets/img/species/tree/microcebusmurinus.png',
                      children: [],
                    }, // 狐猴
                    // { id: 'Callithrix jacchus(White-tufted-ear marmoset)', children: [] }, // 狨猴
                    {
                      id: 'White-tufted-ear marmoset\n狨猴',
                      img: '../../../src/assets/img/species/tree/whitetuftedearmarmoset.png',
                      children: [],
                    }, // 狨猴
                    {
                      id: 'Hominidae\n人科', // 人科
                      img: '../../../src/assets/img/species/tree/hominidae.png',
                      children: [
                        {
                          id: 'Homo sapiens\n人类',
                          img: '../../../src/assets/img/species/tree/homosapiens.png',
                          children: [],
                        }, // 人类
                        {
                          id: 'Pan troglodytes\n黑猩猩',
                          img: '../../../src/assets/img/species/tree/pantroglodytes.png',
                          children: [],
                        }, // 黑猩猩
                        // { id: 'Gorilla gorilla ', children: [] }, // 大猩猩
                        {
                          id: 'Gorilla gorilla gorilla\n大猩猩',
                          img: '../../../src/assets/img/species/tree/gorillagorillagorilla.png',
                          children: [],
                        }, // 大猩猩
                      ],
                    },
                    {
                      id: 'Macaca\n猕猴属', // 猕猴属
                      img: '../../../src/assets/img/species/tree/macaca.png',
                      children: [
                        {
                          id: 'Macaca mulatta\n猕猴',
                          img: '../../../src/assets/img/species/tree/macacamulatta.png',
                          children: [],
                        }, // 猕猴
                        {
                          id: 'Macaca fascicularis\n食蟹猴',
                          img: '../../../src/assets/img/species/tree/macacafascicularis.png',
                          children: [],
                        }, // 食蟹猴
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
      id: 'Magnoliopsida\n双子叶植物纲', // 双子叶植物纲
      img: '../../../src/assets/img/species/tree/magnoliopsida.png',
      children: [
        {
          id: 'Poaceae\n禾本科', // 禾本科
          img: '../../../src/assets/img/species/tree/poaceae.png',
          children: [
            {
              id: 'Zea mays\n玉米',
              img: '../../../src/assets/img/species/tree/zeamays.png',
              children: [],
            }, // 玉米
            {
              id: 'Oryza sativa\n水稻',
              img: '../../../src/assets/img/species/tree/oryzasativa.png',
              children: [],
            }, // 水稻
          ],
        },
        {
          id: 'Glycine max\n大豆',
          img: '../../../src/assets/img/species/tree/glycinemax.png',
          children: [],
        }, // 大豆
        {
          id: 'Arabidopsis thaliana\n拟南芥',
          img: '../../../src/assets/img/species/tree/arabidopsisthaliana.png',
          children: [],
        }, // 拟南芥
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
        const id = item.id.split('\n')[0]
        lastChildList.value.push(id)
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
        show: true,
        /* icon's img address, string type */
        // img: 'https://gw.alipayobjects.com/zos/basement_prod/012bcf4f-423b-4922-8c24-32a89f8c41ce.svg',
        // img: '../../../src/assets/img/species/tree/1488.svg',
        /* icon's size, 20 * 20 by default: */
        // width: 40,
        // height: 40,
      },
      labelCfg: {
        /* label's position, options: center, top, bottom, left, right */
        position: 'bottom',
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
        fill: '#49B24E',
        stroke: '#52c41a',
      },
      label: node.id,
      icon: {
        show: true,
        img: node.img || '',
        width: 50,
        height: 50,
      },
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
    const id = item._cfg.id.split('\n')[0]
    console.log('id', id)
    getSpeciesDatasets(id)
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
