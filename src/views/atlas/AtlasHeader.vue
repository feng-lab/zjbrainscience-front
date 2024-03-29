<template>
  <div :class="['dark', 'atlas-header', 'between-flex--1024px']">
    <div class="center-flex">
      <span class="title p-r-16"> {{ title }} </span>
      <el-tooltip v-if="url">
        <template #content>
          <strong class="p-r-8">Atlas website:</strong>
          <span>{{ url }}</span>
        </template>
        <el-link :href="url" icon="Link" target="_blank" style="font-size:1.25rem"/>
      </el-tooltip>
    </div>
    <div class="toolbar center-flex">
      <div style="text-align: center" v-if="layoutChange" >
        <el-dropdown v-if="subPage.length || (breakpoint !== 'lg' && breakpoint !== 'xl')" @command="handleSetLayout">
          <el-button >Panel Layout <bs-icon-img icon="ArrowDown" class="m-l-8"/></el-button>
          <template #dropdown>
            <el-dropdown-menu> 
              <el-dropdown-item v-for="l in supportLayout" :key="l.layout" :command="l.layout" :class="{active: l.layout === layout}">
                <span class="layout-label">
                  <el-image v-if="l.component.endsWith('.png')" :src="l.component" style="height:24px"/>
                  <span v-else>{{l.component}}</span>
                </span>
                <span>{{ l.tooltip }} </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-radio-group v-model="layout" v-else>
          <el-radio-button v-for="l in supportLayout" :label="l.layout" :key="l.layout">
            <el-tooltip :content="l.tooltip">
              <el-image v-if="l.component.endsWith('.png')" :src="l.component" style="height: 100%" />
              <span v-else> {{ l.component }} </span>
            </el-tooltip>
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-radio-group v-model="currSubPage" v-if="subPage.length">
        <el-radio-button v-for="p in subPage" :label="p.name" :key="p.title" @click="handleChangeSubPage(p.path)">
          <span> {{  p.title  }} </span>
        </el-radio-button>
      </el-radio-group>
      <div>
        <el-select
          placeholder="Switch brain atlas"
          v-model="viewAtlas"
          @change="handleViewAtlas"
        >
          <el-option 
            v-for="atlas in atlasList"
            :key="atlas.id"
            :value="atlas.name"
            :label="atlas.title"
          />
        </el-select>
      </div>
      <el-tooltip content="Render Data" v-if="renderDataSetting">
        <el-button class="icon-button" icon="Grid" @click="showRenderData = !showRenderData" :class="{active: showRenderData}"/>
      </el-tooltip>
      <el-tooltip content="Rendering setting" v-if="renderCtrlSetting">
        <el-button class="icon-button" icon="Setting" @click="showRenderSetting = !showRenderSetting" :class="{active: showRenderSetting}" />
      </el-tooltip> 
      <el-tooltip content="Help information for interaction">
        <el-button class="icon-button" icon="QuestionFilled" @click="showHelper = !showHelper" :class="{active: showHelper}"/>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router';
import { ref, computed, inject } from "vue";
import { useBrainAtlasLayout } from '@/compositions/bsAtlas/useBrainAtlasLayout';
import { useBsAtlasList } from '@/compositions/bsAtlas/useBsAtlas';
import useMediaQuery from '@/stores/mediaQuery';
import { storeToRefs } from 'pinia';

const { breakpoint } = storeToRefs(useMediaQuery());

const props = defineProps({
  subPage: {
    type: Array,
    default: []
  },
  layoutChange: {
    type: Boolean,
    default: true
  },
  renderDataSetting: {
    type: Boolean,
    default: true
  },
  renderCtrlSetting: {
    type: Boolean,
    default: true
  },
  atlasProps: {
    type: Object,
    default: {}
  },
  title: String,
  url: String,
  name: String,
  atlasLayout: String 
});

const emit = defineEmits(["layoutChange"]);

const showHelper = inject('showHelper');
const showRenderSetting = inject('showRenderSetting');
const showRenderData = inject('showRenderData');

const { path } = useRoute();

const viewAtlas = ref(path.replace(/\/atlas\/(\w+).*/, '$1'));

const { 
  atlasList,
  handleViewAtlas,
} = useBsAtlasList();

const {
  supportLayout
} = useBrainAtlasLayout();

const router = useRouter();
const currSubPage = ref(router.currentRoute.value.name);

const layout = computed({
  get() {
    return props.atlasLayout;
  },
  set(value) {
    emit("layoutChange", value)
  }

})

const handleChangeSubPage = (page_path) => {
  router.push(page_path);
}

const handleSetLayout = (l) => {
  layout.value = l;
}

</script>

<style lang="scss" scoped>
.atlas-header {
  padding-right: 48px;
  .title {
    font-size: 2.0rem;
    font-weight: bold;
    color: var(--el-color-primary);
  }

  .toolbar {
    padding: 20px 0px;
    gap: 16px;
    height: 75px;
    :deep(.el-radio-button__inner) {
      height: 32px;
    }
    .icon-button {
      width: 28px;
      height: 32px;
      & + .el-button {
        margin-left: 0px;
      }
    }
  }
}

.layout-label {
  width: 64px;
  text-align: center;
  padding-right: 8px;
  margin: 4px 8px 0;
  font-weight: 800;
  color: var(--bs-text-color);
  border-right: 2px solid var(--bs-border-color);
}

</style>
