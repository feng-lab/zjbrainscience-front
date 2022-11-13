<template>
  <div class="project-card m-b-16 el-card is-always-shadow">
    <div class="project-card-header">
      <div class="between-flex">
        <span class="center-flex project-card-header--title">
          <TheIconImg :icon="icon" :iconColor="iconColor" :size="24" class="m-r-4"/>
          <span class="m-r-8"> {{ title }} </span>
          <slot name="titletail"></slot>
        </span>
        <slot name="extra"></slot>
      </div>
      <div class="project-card-header--desc">
        <span>{{ description }}</span>
      </div>
    </div>
    <div class="project-card-content" :style="contentStyle">
      <slot/>
    </div>
    <div class="project-card-footer">
      <span 
        v-for="btn in buttons"
        :key="btn.text"
        @click="btn.onClick"
        class="project-card-footer--action center-flex"
      >
        <TheIconImg :icon="btn.icon"/> 
        <span class="m-l-4">{{ btn.text }}</span>
      </span>
    </div>
  </div>
</template>
<script setup> 
import TheIconImg from "@/components/TheIconImg.vue";

defineProps({
  icon: {
    type: String,
    default: "Histogram"
  },
  iconColor: {
    type: String,
    default: "#52c41a"
  },
  title: String,
  buttons: Array,
  description: String,
  contentStyle: Object
})

</script>
<style lang="scss" scoped>
.project-card {
  &-header {
    padding: 12px 20px;
    &--title {
      font-size: 24px;
      font-weight: 700;
      color: var(--el-text-color-regular);
    }
    &--desc {
      margin-left: 28px;
      color: var(--el-text-color-secondary);
    }
  }
  &-content {
    padding: 0 20px 12px;
    &--desc {
      color: var(--el-text-color-secondary);
    }
  }

  &-footer {
    height: 48px;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid var(--el-border-color);
    &--action {
      flex: 1;
      //color: var(--el-text-color-secondary);
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