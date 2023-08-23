<template>
  <div class="toolbar dark">
    <div style="text-align: center" v-if="layoutChange" >
      <el-radio-group v-model="layout">
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
          v-for="atlas in atlasList.filter(a => a.name !== atlasProps.name)" 
          :key="atlas.id"
          :value="atlas.name"
          :label="atlas.title"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>

import { useAtlas } from '@/compositions/atlas/useAtlas';
import { useRouter } from 'vue-router';
import { ref, computed } from "vue";

const props = defineProps({
  subPage: {
    type: Array,
    default: []
  },
  layoutChange: {
    type: Boolean,
    default: true
  },
  atlasProps: {
    type: Object,
    default: {}
  },
  segmentsLayout: String 
});

const emit = defineEmits(["layoutChange"]);

const viewAtlas = ref();
const { 
  atlasList,
  supportLayout,
  handleViewAtlas,
} = useAtlas();

const router = useRouter();
const currSubPage = ref(router.currentRoute.value.name);

const layout = computed({
  get() {
    return props.segmentsLayout;
  },
  set(value) {
    console.log('value', value)
    emit("layoutChange", value)
  }

})

const handleChangeSubPage = (page_path) => {
  router.push(page_path);
}

</script>
<style lang="scss" scoped>
.toolbar {
  padding: 20px 0px;
  gap: 16px;
  display: flex;
  align-items: center;
  justify-content: end;
  height: 75px;
  :deep(.el-radio-button__inner) {
    height: 32px;
  }
}
</style>
