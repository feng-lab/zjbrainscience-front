<template>
  <!-- <el-card body-style="height: calc(100vh - 200px)"> -->
  <!-- <bs-load-more
      :height="880"
      ref="loadRef"
      :limit="20"
      :load-method="allExByPageApi"
      :query="query"
      v-model="exList"
    > -->
  <el-scrollbar
    height="calc(100vh - 230px)"
    v-loading="exLoading"
    element-loading-text="加载中..."
  >
    <el-row style="margin-left: 10px">
      <el-form :inline="true" :model="query">
        <el-form-item label="物种:">
          <!-- <el-select v-model="query.species" placeholder="请选择" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select> -->
          <el-input v-model="query.species" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="器官:">
          <el-input v-model="query.organ" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="发育时期:">
          <el-input
            v-model="query.development_stage"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
          <el-button type="default" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row v-if="!isDataSave">
      <el-alert
        :title="`提示：系统检测到一条数据未保存。`"
        type="info"
        show-icon
        style="margin-bottom: 15px"
      >
        <el-link
          type="success"
          style="position: absolute; top: -28px; left: 280px; font-size: 16px"
          :underline="false"
          @click="goEdit"
          >继续编辑</el-link
        >
      </el-alert>
    </el-row>
    <el-row v-if="exList.length">
      <el-col
        v-for="ex in exList"
        :key="ex.id"
        :xs="24"
        :sm="12"
        :lg="8"
        :xl="6"
      >
        <bs-project-card
          :title="getTitleEllipsis(ex.description)"
          icon-color="#faad14"
          :icon="getIconComponent(ex.species)"
          :content-style="{
            minHeight: '180px',
          }"
          :buttons="[
            {
              text: $t('button.edit'),
              icon: 'Edit',
              hide: user.access_level < 100,
              onClick: () => handleEdit(ex.id),
            },
            {
              text: $t('button.detail'),
              icon: 'View',
              onClick: () => handleView(ex.id),
            },
            {
              text: $t('button.delete'),
              icon: 'Delete',
              hide: user.access_level < 100,
              onClick: () => handleDelete(ex.id),
            },
          ]"
        >
          <!-- <template #titletail>
            <el-tag size="small" type="info" class="m-t-4">
              {{ `ID: ${ex.id}` }}
            </el-tag>
          </template> -->
          <!-- <div class="m-b-8">
            物种： {{ ex.species }}
          </div> -->
          <table>
            <tbody>
              <bs-tr icon="Orange" icon-color="#52c41a" label="物种：">
                <div class="text-wrap" :title="ex.species">
                  {{
                    getCnName(ex.species)
                      ? `${ex.species} （${getCnName(ex.species)}）`
                      : ex.species
                  }}
                </div>
              </bs-tr>
              <bs-tr
                icon="Location"
                icon-color="#52c41a"
                :label="
                  $t('datasetManagement.detail.development_stage') + $t('colon')
                "
              >
                <div class="text-wrap" :title="ex.development_stage">
                  {{ ex.development_stage }}
                </div>
              </bs-tr>
              <bs-tr
                icon="Collection"
                icon-color="#52c41a"
                :label="$t('datasetManagement.detail.organ') + $t('colon')"
              >
                <div class="text-wrap" :title="ex.organ">
                  {{ ex.organ }}
                </div>
              </bs-tr>
              <bs-tr
                icon="Document"
                icon-color="#52c41a"
                :label="$t('datasetManagement.detail.cell_count') + $t('colon')"
              >
                <div class="text-wrap" :title="ex.cell_count">
                  {{ ex.cell_count }}
                </div>
              </bs-tr>
              <bs-tr
                icon="Help"
                icon-color="#52c41a"
                :label="$t('datasetManagement.detail.data_type') + $t('colon')"
              >
                <div class="text-wrap" :title="ex.data_type">
                  {{ ex.data_type }}
                </div>
              </bs-tr>
              <bs-tr
                icon="Postcard"
                icon-color="#52c41a"
                :label="
                  $t('datasetManagement.detail.file_format') + $t('colon')
                "
              >
                <div class="text-wrap" :title="ex.file_format">
                  {{ ex.file_format }}
                </div>
              </bs-tr>
            </tbody>
          </table>
        </bs-project-card>
      </el-col>
    </el-row>
    <el-row v-else class="list-empty-wrap">
      <el-empty description="暂无数据" />
    </el-row>
  </el-scrollbar>
  <div class="pagination-wrap">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[20, 50, 100, 200]"
      :small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- </bs-load-more> -->
  <!-- </el-card> -->
</template>

<script setup>
import BsIconExperiment from '@/components/icons/BsIconExperiment.vue'
import BsIconMonkey from '@/components/icons/BsIconMonkey.vue'
import BsIconHuman from '@/components/icons/BsIconHuman.vue'
import BsIconMouse from '@/components/icons/BsIconMouse.vue'
import BsIconFish from '@/components/icons/BsIconFish.vue'
import BsIconPigeon from '@/components/icons/BsIconPigeon.vue'
import BsIconVirus from '@/components/icons/BsIconVirus.vue'
import BsIconSalamander from '@/components/icons/BsIconSalamander.vue'
import BsIconRice from '@/components/icons/BsIconRice.vue'
import BsIconSoybean from '@/components/icons/BsIconSoybean.vue'
import BsIconDrosophila from '@/components/icons/BsIconDrosophila.vue'

import BsTr from '@/components/BsTr.vue'
import BsProjectCard from '@/components/BsProjectCard.vue'
import { FolderOpened } from '@element-plus/icons-vue'
import BsRouteLink from '@/components/BsRouteLink.vue'
import BsLoadMore from '@/components/BsLoadMore.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { allExByPageApi, deleteExApi } from '@/api/datasetManagement'
import { useI18n } from 'vue-i18n'
import { useUtils } from '@/compositions/useUtils'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/user'
import { EXPERIMENT_TYPE } from '@/utils/common.js'
import useAtlasStore from '@/stores/atlas'
import { storeToRefs } from 'pinia'

const router = useRouter()
const i18n = useI18n()
const { systemConfirm } = useUtils()
const { speciesOptions } = storeToRefs(useAtlasStore())

const exList = ref([])
const { user } = useUserStore()

const exLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const small = ref(false)
const pageTotal = ref(500)

const query = ref({
  data_publisher: '',
  experiment_platform: '',
  project: '',
  type: '',
  user_id: user.id,
  data_update_year: '',
  offset: '',
  include_deleted: '',
  limit: 20,
  species: '',
  organ: '',
  development_stage: '',
})
const loadRef = ref()
const isDataSave = ref(JSON.parse(sessionStorage.getItem('isSubmit')))

const goEdit = () => {
  router.push(`/experiments/new`)
}

const getCnName = (name) => {
  if (name) {
    const speciesItem =
      speciesOptions.value.find((item) => item.latin_name === name) || {}
    return speciesItem.chinese_name || ''
  }
  return ''
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getAllExByPage()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  getAllExByPage()
}

const getAllExByPage = async () => {
  try {
    exLoading.value = true
    let offset = (currentPage.value - 1) * pageSize.value
    const res = await allExByPageApi({
      ...query.value,
      offset: offset,
      limit: pageSize.value,
    })
    exLoading.value = false
    pageTotal.value = res.total || 0
    exList.value = res.items || []
  } catch (err) {
    exLoading.value = false
    console.log(err)
  }
}
getAllExByPage()

const onQuery = () => {
  currentPage.value = 1
  getAllExByPage()
}

const onReset = () => {
  query.value.species = ''
  query.value.organ = ''
  query.value.development_stage = ''
  onQuery()
}

const handleView = (id) => {
  // router.push(`/experiments/detail/${id}`)
  router.push(`/experiments/detail/${id}/info`)
}

const handleDelete = (id) => {
  systemConfirm(i18n.t('experiments.deleteConfirm', { id }), async () => {
    await deleteExApi(id)
    ElMessage.success(i18n.t('elmessage.deleteSuccess'))
    onQuery()
    // await loadRef.value.handleLoadMore()
  })
}
const handleEdit = (id) => {
  router.push(`/experiments/edit/${id}`)
}

const getTitleEllipsis = (title) => {
  if (title.length > 20) {
    title = title.slice(0, 14) + '...' + title.slice(-6)
  }
  return title ? title : '--'
}

const getIconComponent = (type) => {
  let icon = BsIconExperiment
  let mouse = [
    'mouse',
    'Mus musculus',
    'Mouse',
    '小鼠',
    'Rattus norvegicus',
    'Rat',
    '鼠',
  ]
  let human = ['human', 'Homo sapiens', 'Human', '人类']
  let monkey = [
    'Macaca mulatta',
    'Monkey/Rhesus macaque',
    '猕猴',
    'Macaca fascicularis',
    'Crab-eating macaque',
    '食蟹猴',
    'Pan troglodytes',
    'Chimp',
    '黑猩猩',
    'Gorilla gorilla gorilla',
    'Gorilla',
    '大猩猩',
    'White-tufted-ear marmoset',
    'Callithrix jacchus',
    '狨猴',
  ]
  let drosophil = ['Drosophila melanogaster', 'Drosophil', '果蝇']
  let zebrafish = ['Danio rerio', 'Zebrafish', '斑马鱼']
  let newt = ['Paramesotriton chinensis', 'Newt', '蝾螈']
  let dove = [
    'Aplopelia bonaparte',
    'Dove',
    '鸽子',
    'Taeniopygia guttata',
    'Zebra finch',
    '斑马雀',
  ]
  let soybean = ['Glycine max', 'Soybean', '大豆']
  let rice = ['Oryza sativa', 'Rice', '水稻']
  let virus = ['Virus', '病毒']
  if (mouse.includes(type)) {
    icon = BsIconMouse
  } else if (human.includes(type)) {
    icon = BsIconHuman
  } else if (monkey.includes(type)) {
    icon = BsIconMonkey
  } else if (drosophil.includes(type)) {
    icon = BsIconDrosophila
  } else if (zebrafish.includes(type)) {
    icon = BsIconFish
  } else if (newt.includes(type)) {
    icon = BsIconSalamander
  } else if (dove.includes(type)) {
    icon = BsIconPigeon
  } else if (soybean.includes(type)) {
    icon = BsIconSoybean
  } else if (rice.includes(type)) {
    icon = BsIconRice
  } else if (virus.includes(type)) {
    icon = BsIconVirus
  }
  return icon
}
</script>

<style scoped lang="scss">
$card-scroll-height: calc(100% - 198px);

.list-empty-wrap {
  display: flex;
  justify-content: center;
}
:deep(.el-icon) {
  color: var(--el-color-success);
}

:deep(.el-alert--info) {
  --el-alert-bg-color: var(--el-color-success-light-9);
  color: #262626;
}
:deep(.el-alert__content) {
  width: 100%;
}
:deep(.el-alert .el-alert__close-btn) {
  top: 6px;
}
.info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  &-item {
    flex: 1;
  }
}
.time-range {
  color: var(--el-text-color-secondary);
}
.text-wrap {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: calc(25vw - 220px);
  padding-right: 20px;
}
.pagination-wrap {
  width: 100%;
  position: absolute;
  bottom: 15px;
  right: 0px;
  left: 0px;
  display: flex;
  justify-content: flex-end;
  background-color: #fff;
  height: 60px;
  padding-right: 30px;
}
</style>
