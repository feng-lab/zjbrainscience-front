<template> 
  <div class="atlas-item">
    <img :src="`${atlas.rootPath}/preview.png`"/>
    <div class="atlas-item-content">
      <div class="atlas-item-content-title">
        {{ atlas.title }} 
      </div>
      <div class="tags m-b-8"> 
        <el-tag type="warning" effect="dark" style="text-transform: capitalize" class="m-r-4">{{ atlas.specy }}</el-tag>
        <el-tag class="el-tag--blue" > {{atlas.team}} </el-tag>
      </div>
      <div class="icon-label"><el-icon><Link/></el-icon><el-link :href="atlas.url">{{ atlas.url }}</el-link></div>
      <div class="icon-label"><el-icon><Timer/></el-icon><span>{{ atlas.createTime }}</span></div>
    </div>
    <div class="atlas-item-footer">
      <span class="icon-label action center-flex" @click="handleDetail">
        <bs-icon-img icon="View"/>
        <span>{{ $t('button.detail') }}</span>
      </span>
      <template v-if="true"> 
        <span class="icon-label action center-flex">
          <bs-icon-img icon="Edit"/>
          <span>{{ $t('button.edit') }}</span>
        </span>
        <span class="icon-label action center-flex">
          <bs-icon-img icon="Delete"/>
          <span>{{ $t('button.delete') }}</span>
        </span>
      </template>
    </div>
  </div>
</template>
<script setup>import { useRouter } from 'vue-router';

const props = defineProps({
  atlas: Object
})

const router = useRouter();
const handleViewAtlas = (atlas) => {
  console.log('view', atlas);
}

const handleDetail = () => {
  router.push(`/visualize/atlas/${props.atlas.id}/detail`)
}

</script>
<style lang="scss" scoped>
.atlas-item {
  width: 300px;
  height: 400px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--el-bg-color-page);
  img {
    width: 100%;
    height: 50%;
    object-fit: fill;
  }
  &-content {
    padding: 18px 16px;
    &-title {
      color: var(--el-color-primary);
      font-weight: bolder;
      font-size: 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  &-footer {
    height: 48px;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid var(--el-border-color);
    .action {
      flex: 1;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.45);
      cursor: pointer;
      &:not(:last-child) {
        border-right: 1px solid var(--el-border-color);
      }
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>