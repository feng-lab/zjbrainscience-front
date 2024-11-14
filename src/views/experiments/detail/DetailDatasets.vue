<template>
  <div>
    <div class="base-info-wrap">
      <div class="btn-wrap">
        <el-button type="danger" size="default" @click="pageBack"
          >返回</el-button
        >
      </div>
      <div class="info-header">
        <div>
          <span class="datasets-name">数据集名称</span>
          <el-button type="success" plain size="small" @click="goEdit"
            >编辑</el-button
          >
        </div>
        <div @click="handleChange" class="datasets-more">
          <span class="more">{{ showMore ? '收起' : '展开' }}详情</span>
          <div :class="showMore ? 'down' : 'up'">
            <el-icon><ArrowDown /></el-icon>
          </div>
        </div>
      </div>
      <ul class="base-info">
        <li>
          <div class="info desc">
            <div class="label">{{ getBaseInfoItem(0, 1)[0]['label'] }}：</div>
            <div class="content">
              <el-tooltip
                :content="getBaseInfoItem(0, 1)[0]['value']"
                effect="light"
                placement="top"
              >
                {{ getBaseInfoItem(0, 1)[0]['value'] || '--' }}
              </el-tooltip>
            </div>
          </div>
        </li>
        <li>
          <div
            v-for="(item, index) in getBaseInfoItem(1, 7)"
            :key="index"
            class="info"
          >
            <div class="label">{{ item.label }}：</div>
            <div class="content">
              <el-tooltip :content="item.value" placement="top" effect="light">
                {{ item.value || '--' }}
              </el-tooltip>
            </div>
          </div>
        </li>
        <li :class="showMore ? 'more-info' : 'no-info'">
          <div
            v-for="(item, index) in getBaseInfoItem(7)"
            :key="index"
            class="info"
          >
            <div class="label">{{ item.label }}：</div>

            <div class="content">
              <el-tooltip :content="item.value" placement="top" effect="light">
                {{ item.value || '--' }}
              </el-tooltip>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <el-tabs v-model="activeType" class="tabs-wrap" @tab-click="handleClick">
      <el-tab-pane label="文件" name="file"><BsDatasetsFile /></el-tab-pane>
      <!-- <el-tab-pane label="可视化" name="view">Config</el-tab-pane>
      <el-tab-pane label="数据分析" name="data">Role</el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BsDatasetsFile from '@/components/detail/BsDatasetsFile.vue'
import { useRoute, useRouter } from 'vue-router'
import { exDetailApi } from '@/api/datasetManagement'

// const props = defineProps({
//   experiment_id: String,
// })
const showMore = ref(false)
const baseInfoList = ref([
  {
    label: '数据集简述',
    value: '',
    key: 'description',
  },
  { label: '数据类型', value: '', key: 'data_type' },
  { label: '物种', value: '', key: 'species' },
  {
    label: '发育时期',
    value: '',
    key: 'development_stage',
  },
  { label: '组织/器官', value: '', key: 'organ' },
  { label: '细胞数量', value: '', key: 'cell_count' },
  {
    label: '相关疾病',
    value: '',
    key: 'associated_diseases',
  },
  { label: '文件格式', value: '', key: 'file_format' },
  { label: '文件数量', value: '', key: 'file_count' },
  { label: '样本数量', value: '', key: 'sample_count' },
  { label: '数据来源', value: '', key: 'source' },
  { label: '数据总量', value: '', key: 'file_total_size_gb' },
  { label: '已获取量', value: '', key: 'file_acquired_size_gb' },
  { label: '更新时间', value: '', key: 'data_update_year' },
  { label: '测序平台', value: '', key: 'experiment_platform' },
  { label: '联系人', value: '', key: 'contactor' },
])
const activeType = ref('file')
const route = useRoute()
const router = useRouter()

const pageBack = () => {
  router.push({
    path: '/experiments/list',
  })
}

const handleChange = (val) => {
  showMore.value = !showMore.value
}
const getBaseInfoItem = (start, end) => {
  return baseInfoList.value.slice(start, end)
}

const goEdit = () => {
  router.push(`/experiments/edit/${route.params.experiment_id}`)
}

onMounted(async () => {
  const exForm = await exDetailApi(route.params.experiment_id)
  baseInfoList.value.forEach((item) => {
    item.value = exForm[item.key]
  })
})
</script>

<style lang="scss" scoped>
.base-info-wrap {
  padding: 20px 16px 0;
  .btn-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .info-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .datasets-name {
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #323233;
      margin-right: 10px;
    }
    .datasets-more {
      cursor: pointer;
      color: #72c040;
      .more {
        font-size: 14px;
        text-align: right;
        color: #72c040;
        margin-right: 5px;
      }
      .up {
        transition: all 0.3s;
        display: inline-block;
      }
      .down {
        display: inline-block;
        transform: rotate(180deg);
        transition: all 0.3s;
      }
    }
  }
  .base-info {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    li {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .more-info {
      width: 100%;
      max-height: 150px;
      transition: all 0.3s;
      margin-top: 5px;
    }
    .no-info {
      width: 100%;
      max-height: 0px;
      overflow: hidden;
      transition: all 0.2s;
    }
    .info {
      width: 16%;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #323233;
      margin-bottom: 10px;
      display: flex;
      &.desc {
        width: 100%;
      }
      .label {
        width: 90px;
      }
      .content {
        width: calc(100% - 90px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 10px;
      }
    }
  }
}
.tabs-wrap {
  // margin-top: 40px;
  margin: 40px 32px 0;
}
</style>
