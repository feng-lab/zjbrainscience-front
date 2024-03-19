<template>
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
            :title="ex.species"
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
            <div class="m-b-8">
              <div>{{ ex.description }}</div>
            </div>
            <table>
              <tbody>
                <bs-tr icon="Location" icon-color="#52c41a" :label="$t('datasetManagement.detail.development_stage') + $t('colon')">
                  {{ ex.development_stage }} 
                </bs-tr>
                <bs-tr icon="Collection" icon-color="#52c41a" :label="$t('datasetManagement.detail.organ') + $t('colon')">
                  {{ ex.organ}} 
                </bs-tr>
                <bs-tr icon="Document" icon-color="#52c41a" :label="$t('datasetManagement.detail.cell_count') + $t('colon')">
                  {{ ex.cell_count}} 
                </bs-tr>
                <bs-tr icon="Help" icon-color="#52c41a" :label="$t('datasetManagement.detail.data_type') + $t('colon')">
                  {{ ex.data_type}} 
                </bs-tr>
                <bs-tr icon="Postcard" icon-color="#52c41a" :label="$t('datasetManagement.detail.file_format') + $t('colon')">
                  {{ ex.file_format }} 
                </bs-tr>
              </tbody>
            </table>
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
import { allExByPageApi, deleteExApi } from "@/api/datasetManagement";
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

const query = ref({
  data_publisher: "",
  experiment_platform: "",
  project: "",
  type: "",
  user_id: user.id,
  data_update_year:"",
  offset:"",
  include_deleted:""
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