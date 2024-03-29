<template>
  <el-card class="m-b-16">
    <el-row :gutter="12" class="multiple-line-row">
      <el-col :xs="24" :lg="9" :xl="12">
        <div class="button-line">
          <bs-route-link path="/experiments/new" type="primary" v-if="user.access_level > 10">
            <el-icon><Plus/></el-icon>
            {{ $t("experiments.action.new") }}
          </bs-route-link>
          <bs-sort-button
            :text="$t('button.sortByType')"
            :order="query.sort_by === 'type' && query.sort_order"
            @click.prevent="setSortBy('type')"
          />
          <bs-sort-button
            :text="$t('button.sortByTime')"
            :order="query.sort_by === 'start_time' && query.sort_order"
            @click="setSortBy('start_time')"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="5" :xl="4">
        <el-select v-model="query.type" style="width: 100%" clearable :placeholder="$t('experiments.detail.type')">
          <el-option 
            v-for="(label, value) in EXPERIMENT_TYPE"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="8" :lg="5" :xl="4">
        <el-input
          clearable
          v-model="query.tag"
          :placeholder="$t('placeholder.search', { content: $t('experiments.detail.tags')})"
          prefix-icon="Search"
        />
      </el-col>
      <el-col :xs="24" :sm="8" :lg="5" :xl="4">
        <el-input 
          clearable
          v-model="query.name"
          :placeholder="$t('placeholder.search', { content: $t('experiments.detail.name')})"
          prefix-icon="Search"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card body-style="min-height: calc(100vh - 200px)">
    <bs-load-more 
      :height="720"
      ref="loadRef"
      :limit="8"
      :load-method="allExByPageApi"
      :query="query"
      v-model="exList">
      <el-row>
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
              hide: user.access_level < 100,
              onClick: () => handleEdit(ex.id)
            }, {
              text: $t('button.detail'),
              icon: 'View',
              onClick: () => handleView(ex.id)
            }, {
              text: $t('button.delete'),
              icon: 'Delete',
              hide: user.access_level < 100,
              onClick: () => handleDelete(ex.id)
            }]"
          >
            <template #titletail>
              <el-tag size="small" type="info" class="m-t-4">
                {{ `ID: ${ex.id}`}} 
              </el-tag>
            </template>
            <template #extra> 
              <el-tag :type="statusTag[ex.type.toLowerCase()]"> 
                {{ EXPERIMENT_TYPE[ex.type] }} 
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
            <el-tag
              v-for="tag in ex.tags"
              :key="tag"
              class="m-r-8 m-t-8"
              effect="dark"
            >
              {{ tag }}
            </el-tag>
          </bs-project-card>
        </el-col>
      </el-row>
    </bs-load-more>
  </el-card>
</template>
<script setup>
import BsIconExperiment from "@/components/icons/BsIconExperiment.vue";
import BsTr from "@/components/BsTr.vue";
import BsProjectCard from "@/components/BsProjectCard.vue";
import { FolderOpened } from "@element-plus/icons-vue";
import BsRouteLink from "@/components/BsRouteLink.vue";
import BsLoadMore from "@/components/BsLoadMore.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { allExByPageApi, deleteExApi } from "@/api/experiments";
import { useI18n } from "vue-i18n";
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";
import useUserStore from "@/stores/user";
import { EXPERIMENT_TYPE } from "@/utils/common.js";

const router = useRouter();
const i18n = useI18n();
const { systemConfirm } = useUtils();

const exList = ref([]);
const { user } = useUserStore();

const statusTag = {
  "mi": "success",
  "ssvep": "warning",
  "others": "danger",
  "neuron": "blue",
  "p300": "purple"
}

const query = ref({
  name: "",
  sort_by: "start_time",
  sort_order: "desc",
  type: "",
  tag: ""
})

const loadRef = ref();

const handleView = (id) => {
  router.push(`/experiments/detail/${id}`)

}

const handleDelete = (id) => {
  systemConfirm(
    i18n.t("experiments.deleteConfirm", { id }), 
    async () => {
      await deleteExApi(id);
      ElMessage.success(i18n.t("elmessage.deleteSuccess"));
      await loadRef.value.handleLoadMore();
  })
}
const handleEdit = (id) => {
  console.log('go to path', `/experiments/edit/${id}`)
  router.push(`/experiments/edit/${id}`);
}

const setSortBy = (byLable) => {
  let _sortOrder;
  const { sort_by, sort_order } = query.value;
  if( sort_by === byLable) {
    _sortOrder =  sort_order === "asc" ? "desc" : "asc";
  } else {
    _sortOrder = "desc";
  }
  query.value = {
    ...query.value,
    sort_by: byLable,
    sort_order: _sortOrder
  }
}
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