<template>
  <li class="list-item">
    <div class="list-item-meta">
      <div class="list-item-meta--avatar">
          <slot name="avatar"></slot>
      </div>
      <div class="list-item-meta--content">
        <div class="list-item-meta--content--title"> 
            <span class="list-item-meta--content--title--text">{{ title }}</span>
            <slot name="extra"></slot>
        </div>
        <span class="list-item-meta--content--description">
            <template v-if="description"> 
              {{ description }}
            </template>
            <slot v-else name="description"></slot>
        </span>
      </div>
    </div>
    <div class="list-item-content">
        <slot></slot>
    </div>
    <div class="list-item-actions">
      <template 
        v-for="(action, index) in actions"
        :key="action.text"
      >
        <el-divider direction="vertical" v-if="index"/>
        <el-button 
          type="primary" 
          link 
          size="small"
          @click="action.onClick"
        >
          {{ action.text }}
        </el-button>
      </template>
    </div>
  </li>
</template>
<script setup> 
defineProps({
    title: String,
    description: String,
    actions: Array
})
</script>
<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 12px 24px;
  @media only screen and (max-width: 426px) {
    flex-direction: column;
    align-items: flex-start;
  }
  &-meta {
    display: flex;
    flex: 1 1;
    align-items: center;
    justify-content: flex-start;
    max-width: 100%;
    &--avatar {
      margin-right: 16px;
      font-size: 24px;
    }
    &--content {
      cursor: pointer;
      flex: 1 0;
      &--title {
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &--text {
          font-weight: bold;
          margin-right: 4px;
        }
      }
      &--description {
        color: var(--el-text-color-secondary);
      }
    }
  }
  &-content {
    display: flex;
    @media only screen and (max-width: 426px) {
      flex-direction: column;
      align-items: flex-start;
    }
    flex: 1;
    &--item {
      display: inline-block;
      margin-left: 40px;
      vertical-align: middle;
      span {
        color: var(--el-text-color-regular);
      }
      p {
        color: var(--el-text-color-placeholder);
      }
    }
  }
  &-actions {
    flex: 0 0 auto;
    margin-left: 48px;
    @media only screen and (max-width: 426px) {
      margin-left: 38px;
    }
    padding: 0px;
  }
}
</style>