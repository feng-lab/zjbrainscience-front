<template>
  <el-card class="m-b-16">
    <el-row :gutter="12" class="multiple-line-row">
      <el-col :xs="24" :sm="16" :xl="20">
        <div class="button-line">
        <bs-route-link path="/experiments/new" type="primary">
          <el-icon><Plus/></el-icon>
          {{ $t("experiments.action.new") }}
        </bs-route-link>
        <bs-sort-button
          :text="$t('button.sortByType')"
          :order="listParams.sort_by === 'type' && listParams.sort_order"
          @click.prevent="setSortBy('type')"
        />
        <bs-sort-button
          :text="$t('button.sortByTime')"
          :order="listParams.sort_by === 'start_time' && listParams.sort_order"
          @click="setSortBy('start_time')"
        />
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :xl="4">
        <el-input 
          class="col-right-btn" 
          v-model="listParams.search"
          :placeholder="$t('placeholder.search', { content: $t('experiments.detail.name')})"
          prefix-icon="Search"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-empty v-if="!exList.length"/>
    <el-scrollbar height="var(--brain-body-scroll-height)" v-else>
      <el-row :gutter="16">
        <el-col
          v-for="ex in exList"
          :key="ex.id"
          :xs="24"
          :sm="12"
          :lg="8"
          :xl="6"
        >
          <bs-project-card
            :title="ex.name"
            icon-color="#faad14"
            :icon="BsIconExperiment"
            :content-style="{
              minHeight: '180px'
            }"
            :buttons="[{
              text: $t('button.edit'),
              icon: 'Edit',
              onClick: () => handleEdit(ex.id)
            }, {
              text: $t('button.detail'),
              icon: 'View',
              onClick: () => handleView(ex.id)
            }, {
              text: $t('button.delete'),
              icon: 'Delete',
              onClick: () => handleDelete(ex.id)
            }]"
          >
            <template #extra> 
              <el-tag :type="statusTag[ex.type.toLowerCase()]"> 
                {{ex.type}} 
              </el-tag>
            </template>
            <div class="m-b-8">
              <div>{{ ex.description }}</div>
            </div>
            <table>
              <tbody>
                <bs-tr icon="User" icon-color="#52c41a" :label="'Session' + $t('colon')">
                  {{ ex.session_num }} 
                </bs-tr>
                <bs-tr icon="FolderOpened" icon-color="#52c41a" :label="'Trails' + $t('colon')">
                  {{ ex.trail_num }} 
                </bs-tr>
                <bs-tr icon="Clock" icon-color="#52c41a" :label="$t('label.startTime') + $t('colon')">
                  {{ ex.start_at}} 
                </bs-tr>
                <bs-tr icon="Clock" icon-color="#52c41a" :label="$t('label.endTime') + $t('colon')">
                  {{ ex.end_at}} 
                </bs-tr>
              </tbody>
            </table>
          </bs-project-card>
        </el-col>
      </el-row>
      <div class="load-more-btn" v-if="loadmore">
          <el-button type="danger" @click="loadEx('more')" :loading="loading">
            {{$t("button.load")}}{{$t("button.more")}}
          </el-button>
      </div>
    </el-scrollbar>
  </el-card>
</template>
<script setup>
import BsIconExperiment from "@/components/icons/BsIconExperiment.vue";
import BsTr from "@/components/BsTr.vue";
import BsProjectCard from "@/components/BsProjectCard.vue";
import { FolderOpened } from "@element-plus/icons-vue";
import BsRouteLink from "@/components/BsRouteLink.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { allExByPageApi, deleteExApi } from "@/api/experiments";
import { useI18n } from "vue-i18n";
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";

const router = useRouter();
const i18n = useI18n();
const { systemConfirm } = useUtils();

const exList = ref([]);
const loading = ref(false);
const loadmore = ref(true);

onMounted(() => {
  loadEx();
})

const statusTag = {
  "mi": "success",
  "ssvep": "danger",
  "others": "warning",
  "neuronspike": "purple",
  "p300": "blue"
}

const listParams = ref({
  search: "",
  sort_by: "start_time",
  sort_order: "desc",
  offset: 0,
  limit: 10, 
})

const loadEx = async (more) => {
  loading.value = true;
  if(more) {
    listParams.value.offset = exList.value.length;
  }
  const res = await allExByPageApi(listParams.value);
  loading.value = false;
  if(res.length < listParams.value.limit) {
    loadmore.value = false;
  }
  exList.value = more ? [...exList.value, ...res ] : res;
  listParams.value.offset = 0;
}

const handleView = (id) => {
  router.push(`/experiments/detail/${id}`)

}

const handleDelete = (id) => {
  systemConfirm(
    i18n.t("experiments.deleteConfirm", { id }), 
    async () => {
      await deleteExApi(id);
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
      await loadEx();
  })
}

const handleEdit = (id) => {
  console.log('go to path', `/experiments/edit/${id}`)
  router.push(`/experiments/edit/${id}`);
}

const setSortBy = (byLable) => {
  let _sortOrder;
  const { sort_by, sort_order } = listParams.value;
  if( sort_by === byLable) {
    _sortOrder =  sort_order === "asc" ? "desc" : "asc";
  } else {
    _sortOrder = "desc";
  }
  listParams.value = {
    ...listParams.value,
    sort_by: byLable,
    sort_order: _sortOrder
  }
}

watch(listParams, () => {
  loadEx();
}, {deep: true})

</script>
<style scoped lang="scss">

$card-scroll-height: calc(100% - 198px);


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
</style>