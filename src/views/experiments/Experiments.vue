<template>
  <el-card class="m-b-16">
    <el-row :gutter="12" class="multiple-line-row">
      <el-col :xs="24" :sm="16" :xl="20">
        <el-button type="primary" @click="showNewForm" icon="Plus">{{ $t("button.newEx") }}</el-button>
        <TheSortButton
          :text="$t('button.sortByType')"
          :order="listParams.sortBy === 'type' && listParams.sortOrder"
          @click.prevent="setSortBy('type')"
        />
        <TheSortButton
          :text="$t('button.sortByTime')"
          :order="listParams.sortBy === 'starttime' && listParams.sortOrder"
          @click="setSortBy('starttime')"
        />
      </el-col>
      <el-col :xs="24" :sm="8" :xl="4">
        <el-input 
          class="col-right-btn" 
          :placeholder="$t('placeholder.search', { content: $t('experiments.searchField.name')})"
          prefix-icon="Search"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-scrollbar height="780px">
      <el-row :gutter="16">
        <el-col
          v-for="ex in exList"
          :key="ex.experimentsid"
          :xs="24"
          :sm="12"
          :lg="8"
          :xl="6"
        >
          <TheProjectCard
            :title="ex.experimentsid"
            iconColor="#faad14"
            :icon="IconExperiment"
            :contentStyle="{
              minHeight: '180px'
            }"
            :buttons="[{
              text: $t('button.detail'),
              icon: 'View',
              onClick: () => handleView(ex.experimentsid)
            }]"
          >
            <template #extra> 
              <el-tag :type="statusTag[ex.experimentstype.toLowerCase()]"> 
                {{ex.experimentstype }} 
              </el-tag>
            </template>
            <div class="m-b-8">
              <div>{{ ex.description }}</div>
            </div>
            <table>
              <tbody>
                <TheTr icon="User" iconColor="#52c41a" :label="'Session' + $t('colon')">
                  {{ ex.numberofsessions }} 
                </TheTr>
                <TheTr icon="FolderOpened" iconColor="#52c41a" :label="'Trails' + $t('colon')">
                  {{ ex.numberoftrails }} 
                </TheTr>
                <TheTr icon="Clock" iconColor="#52c41a" :label="$t('label.startTime') + $t('colon')">
                  {{ ex.startdate }} 
                </TheTr>
                <TheTr icon="Clock" iconColor="#52c41a" :label="$t('label.endTime') + $t('colon')">
                  {{ ex.enddate }} 
                </TheTr>
              </tbody>
            </table>
          </TheProjectCard>
        </el-col>
      </el-row>
      <!--
      <TheList>
        <TheListItem
          v-for="ex in exList"
          :key="ex.experimentsid"
          :title="ex.experimentsid"
          :description="ex.description"
          :actions="[{ text: $t('button.detail'), onClick: () => handleView(ex.experimentsid)}]"
        >
          <template #avatar>
            <el-icon color="#faad14"><IconExperiment/></el-icon>
          </template>
          <template #extra>
            <el-tag :type="statusTag[ex.experimentstype.toLowerCase()]"> 
              {{ex.experimentstype }} 
            </el-tag>
          </template>
          <TheListItemContent
            title="Session"
            :content="ex.numberofsessions"
          />
          <TheListItemContent
            title="Trails"
            :content="ex.numberoftrails"
          />
          <TheListItemContent
            :title="$t('label.startTime')"
            :content="ex.startdate"
          />
        </TheListItem>
      </TheList>
      -->
      <div class="load-more-btn" v-if="loadmore">
          <el-button type="danger" @click="loadEx('more')" :loading="loading">{{$t("button.load")}}{{$t("button.more")}}</el-button>
      </div>
    </el-scrollbar>
    <ExperimentsForm v-model="showForm"/>
  </el-card>
</template>
<script setup>

import { computed, onMounted, ref } from "vue";
import IconExperiment from "@/components/icons/IconExperiment.vue";
import TheTr from "@/components/TheTr.vue";
import ExperimentsForm from "./forms/FormExperiments.vue";
import { useRouter } from "vue-router";
import { allExByPageApi } from "@/api/experiments";
import TheProjectCard from "@/components/TheProjectCard.vue";
import { useI18n } from "vue-i18n";
import { FolderOpened } from "@element-plus/icons-vue";
import TheStatistic from "@/components/TheStatistic.vue";
import TheList, { TheListItem, TheListItemContent } from "@/components/list";

const router = useRouter();

const showForm = ref(false);
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
const i18n = useI18n();

const buttons = computed(() => {
  return exid => {
    return [{
      text: i18n.t("button.detail"),
      icon: "View",
      onClick: () => handleView(exid)
    }, {
      text: i18n.t("button.delete"),
      icon: "Delete",
      onClick: () => handleDelete(exid)
    }]
  }
})

const listParams = ref({
  sortBy: "starttime",
  sortOrder: "desc",
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

const showNewForm = () => {
  showForm.value = true;
}

const handleView = (id) => {
  router.push(`/experiments/${id}`)

}

const handleDelete = (id) => {
  console.log('handle delete experiment: ', id );
}

const setSortBy = (byLable) => {
  const { sortBy, sortOrder } = listParams.value;
  if( sortBy === byLable) {
    listParams.value.sortOrder =  sortOrder === "asce" ? "desc" : "asce";
  } else {
    listParams.value.sortOrder = "desc";
  }
  listParams.value.sortBy = byLable;
  loadEx();
}
</script>
<style scoped lang="scss">
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