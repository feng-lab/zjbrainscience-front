<template>
  <div class="dark atlas-home">
    <div class="atlas-header">
      Brain Atlas Datasets
    </div>
    <div class="atlas-description"> 
      <p class="m-b-16">This site visualizes the brain atlas of multiple species based on the data from multiple publicly datasets.</p>
      <ul>
        <li>
          Interactively access these brain atlas via mouse, keyboard, etc.
        </li>
        <li>
          Search, select and display brain regions in 3D view and three 2D cross-sectional views, and the layout of these views can be changed as needed.
        </li>
        <li>
          Provides visualision of other datas for partial brain atlas, such as connectivity, Functional Connectivity, Structural Connectivity, etc.
        </li>
      </ul>

    </div>
    <div class="atlas-list">
      <div class="atlas-item" v-for="atlas in atlasList" :key="atlas.id">
        <div class="atlas-panel">
          <img :src="`${atlasUrl}/${atlas.name}/preview.png`"/>
          <div class="atlas-panel-content">
            <div class="atlas-panel-content-title">
              {{ atlas.title }} 
              <el-tag type="success">{{  atlasType[atlas.name] }}</el-tag>
            </div>
            <div><el-link :href="atlas.url">{{ atlas.url }}</el-link></div>
            <div class="m-t-12">
              <el-link type="primary" icon="View" @click="handleViewAtlas(atlas.name)">
                <span style="font-weight: bold">View the atlas</span>
              </el-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  
</template>

<script setup>

import { getAtlasByPage } from "@/api/atlas";
import { useBsAtlas, useBsAtlasList } from "@/compositions/bsAtlas/useBsAtlas";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const atlasType = {
  bn_atlas: "Human",
  allen_ccf: "Mouse",
  macaque_bna: "Macaque",
  eeum: "Lemur",
  fly: "Fly"
}

const atlasUrl = `http://${window.location.host}/atlas_data`;

const {
  atlasList,
  handleViewAtlas
} = useBsAtlasList();




</script>

<style lang="scss" scoped>
.atlas-header {
  text-align: center;
  font-size: 3.5rem;
  font-family: fantasy;
  color: #1668dc;
}
.atlas-home {
  width: 80%;
  height: 80vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.atlas-description {
  font-size: 1.5rem;
  font-family: Georgia, 'Times New Roman', Times, serif;
  margin:48px auto;
}
.atlas-panel {
  background: rgba(183, 220, 250, .2);
  height: 340px;
  margin: 24px 8px;
  border: 1px solid #65a9f3;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
  img {
    width: 100%;
    height: 180px;
  }
  &-content {
    padding: 24px 16px;
    &-title {
      font-weight: bolder;
      font-size: 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .el-tag {
      --el-tag-font-size: 14px;
    }
  }
}

.atlas-list {
  display: flex;
  > * {
    flex: 1;
  }
}
</style>