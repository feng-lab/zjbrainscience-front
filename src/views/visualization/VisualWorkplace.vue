<template>
  <el-row :gutter="8" class="multiple-line-row m-b-8"> 
    <el-col :xs="24" :sm="12" :md="6" v-for="key in statistic" :key="key">
      <bs-info-card
        :title="$t(`visualization.statistic.${key}`)"
        :info="statisticInfo[key]"
        :img-src="imageInfo[key]"
        :class="[{'active-card': active === key}, 'info-card', `info-card-${key}` ]"
        @click="() => changeShow(key)"
        style="cursor:pointer"
      />
    </el-col>
  </el-row>
  <el-row :gutter="8">
    <el-col :xs="24" :sm="16">
      <el-card class="m-b-8">
        <div >
          <el-button type="primary" icon="Plus" @click="showAtlasForm = true">{{ $t('visualization.action.new') }} </el-button>
          <el-button type="primary" icon="View">{{ $t('visualization.action.showAll') }} </el-button>
          <div class="right search">
            <el-input :placeholder="$t('visualization.properties.name')"/>
            <el-select :placeholder="$t('visualization.properties.specy')"></el-select>
            <el-select :placeholder="$t('visualization.properties.public')">
              <el-option :value="true">{{ $t('label.yes') }}</el-option>
              <el-option :value="false">{{ $t('label.no') }}</el-option>
            </el-select>
          </div>
        </div>
      </el-card>
      <el-card class="content" body-style="padding: 20px 0 ">
        <template #header> 
          {{ $t('visualization.module.atlasList') }} - {{$t(`visualization.statistic.${active}`)}}
        </template>
        <div v-if="atlasList.length" class="atlas-pages">
          <div class="move-action move-action-left center-flex" @click="() => showAtlas('prev')"> <el-icon><arrow-left-bold/></el-icon></div>
          <div class="atlas-list between-flex" id="atlas-list"> 
            <visual-atlas-card v-for="atlas in atlasList" :key="atlas.id" :atlas="atlas"/>
          </div>
          <div class="move-action move-action-right center-flex" @click="() => showAtlas('next')"> <el-icon><arrow-right-bold/></el-icon></div>
        </div>
        <el-empty v-else/>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="8">
      <el-card :header="$t('visualization.module.taskList')">
        <visual-convert-task v-for="task in taskList" :key="task.id" :task="task"/>
      </el-card>
    </el-col>
  </el-row>
  <visual-atlas-form v-model="showAtlasForm"/>
</template>
<script setup>
import BsInfoCard from '@/components/BsInfoCard.vue';
import AtlasCreate from "@/assets/img/create.png";
import AtlasOwner from "@/assets/img/owner.png";
import AtlasProcessing from "@/assets/img/processing.png";
import AtlasPublic from "@/assets/img/public.png";
import AtlasCreateLight from "@/assets/img/create_green-9.png";
import { ref } from "vue";
import VisualAtlasCard from './components/VisualAtlasCard.vue';
import VisualConvertTask from './components/VisualConvertTask.vue';
import VisualAtlasForm from './forms/VisualAtlasForm.vue';

const statistic = ['create', 'owner', 'processing', 'public']
const active = ref("create")

const query = ref({
  offset: 0,
  limit: 3
})

const showAtlasForm = ref(false);

const totalNum = ref();

const imageInfo = {
  create: AtlasCreate,
  owner: AtlasOwner,
  processing: AtlasProcessing,
  public: AtlasPublic
}

const statisticInfo = ref({
  create: 2,
  owner: 2,
  processing: 0,
  public: 3
})

const atlasList = ref([]);
const taskList = ref([]);
atlasList.value = [{
  id:1,
  name: "bn_atlas",
  title: "Brainnetome Human Atlas",
  specy: "human",
  url: "http://www.brainnetome.org",
  isPublic: true,
  owner: "system",
  rootPath: "http://10.11.140.35:2000/atlas_data/bn_atlas",
  creator: "root",
  creatorId: "root",
  createTime: "2022-12-22 00:00:00",
  visible: true,
  team: "Jiang Lab",
  teamLeader: "Jiang"
}, {
  id:2,
  name: "bn_atlas",
  title: "eeum",
  specy: "lemur",
  url: "http://www.eeum-brain.org",
  isPublic: true,
  owner: "system",
  rootPath: "http://10.11.140.35:2000/atlas_data/eeum",
  creator: "root",
  creatorId: "root",
  createTime: "2022-12-22 00:00:00",
  visible: true,
  team: "Feng Lab",
  teamLeader: "Feng"
}, {
  id:3,
  name: "bn_atlas",
  title: "Allen Mouse",
  specy: "mouse",
  url: "https://atlas.brain-map.org",
  isPublic: true,
  owner: "system",
  rootPath: "http://10.11.140.35:2000/atlas_data/allen_ccf",
  creator: "root",
  creatorId: "root",
  createTime: "2022-12-22 00:00:00",
  visible: true,
  team: "Allen Lab",
}]

taskList.value = [{
  id: 1,
  data_name: "regions",
  status: "pending",
  createTime: "2022-12-22 00:00:00",
}, {
  id: 2,
  data_name: "wholeBrains",
  createTime: "2022-12-22 00:00:00",
  status: "running"
}, {
  id: 3,
  data_name: "data1",
  createTime: "2022-12-22 00:00:00",
  status: "success"
}, {
  id: 4,
  data_name: "data2",
  createTime: "2022-12-22 00:00:00",
  status: "failed"
}, {
  id: 5,
  data_name: "data3",
  createTime: "2022-12-22 00:00:00",
  status: "canceled"
}]

const changeShow = (key) => {
  active.value = key;
}

const showAtlas = (direction) => {
  const listItem = document.getElementById("atlas-list");
  const cloneItem = listItem.cloneNode(true);
  cloneItem.id = "clone";
  if(direction === "prev") {
    cloneItem.classList.add("prev-card");
    listItem.classList.add("move-from-back");
  } else {
    cloneItem.classList.add("back-card");
    listItem.classList.add("move-from-prev");
  }

  listItem.parentNode.insertBefore(cloneItem, listItem);
  setTimeout(() => {
    cloneItem.remove();
    listItem.className = "atlas-list between-flex";
  }, 1200);
}

</script>
<style lang="scss">
.info-card {
  cursor: pointer;
  border: none;
  &-processing {
    --shadow-color: rgba(82, 196, 26, 0.3);
    --title-color: var(--el-color-primary-dark-2);
    --info-color: var(--el-color-primary);
  }
  &-owner {
    --shadow-color: rgba(250, 173, 20, 0.3);
    --title-color: var(--el-color-warning-dark-2);
    --info-color: var(--el-color-warning);
  }
  &-create {
    --shadow-color: rgba(24, 144, 255, 0.3);
    --title-color: var(--el-color-blue-dark-8);
    --info-color: var(--el-color-blue);
  }
  &-public {
    --shadow-color: rgba(255, 77, 79, 0.3);
    --title-color: var(--el-color-danger-dark-2);
    --info-color: var(--el-color-danger);
  }
}
.active-card {
  color: white;
  background: white;
  box-shadow: 0px 0px 6px 0px var(--shadow-color);
  .title {
    color: var(--title-color);
  }
  .info {
    color: var(--info-color);
  }
  img {
    filter: brightness(1.2) drop-shadow(2px 4px 6px rgba(0,0,0,0.4));
  }
}
.search {
  display: flex;
  gap: 8px;
}

.atlas-pages {
  position: relative;
  margin: 10px 0;
  height: 400px;
  &:hover .move-action{
    display: flex;
  }
  .atlas-list {
    gap: 16px;
    position: absolute;
    top: 0;
    left: 4%;
    right: 4%;
    height: auto;
    overflow: hidden;
  }
  .move-action {
    z-index: 99;
    font-size: 36px;
    width: 4%;
    height: 100%;
    color: var(--el-text-color-placeholder);
    display: none;
    cursor: pointer;
    position: absolute;
    background: white;
    top: 0%;
    &-left {
      left: 0;
    }
    &-right {
      right: 0;
    }
  }
  .prev-card {
    transition: all .3s ease;
    animation: move-to-left 1.2s ease-in-out both;
  }
  .back-card {
    transition: all .3s ease;
    animation: move-to-right 1.2s ease-in-out both;
  }
  .move-from-back {
    transform: translateX(calc(100% + 16px));
    animation: back-to-zero 1.2s ease-in-out both;
  }

  .move-from-prev {
    transform: translateX(calc(-100% - 16px));
    animation: back-to-zero 1.2s ease-in-out both;
  }
}
@keyframes move-to-left {
  100% {
    transform: translateX(calc(-100% - 16px));
  }
}
@keyframes move-to-right {
  100% {
    transform: translateX(calc(100% + 16px));
  }
}
@keyframes back-to-zero {
  100% {
    transform: translateX(0);
  }
  
}
</style>