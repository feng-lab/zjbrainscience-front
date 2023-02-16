<template>
    <div class="the-list-content-item">
        <div class="the-list-content-item--title"> 
          <bs-icon-img :icon="icon" v-if="icon"/>
          {{ title }} 
        </div>
        <div class="the-list-content-item--content"> {{ content }} </div>
    </div>
</template>
<script setup>
import BsIconImg from "@/components/BsIconImg.vue";
defineProps({
    title: String,
    icon: String,
    content: [String, Number]
})
</script>

<style lang="scss" scoped>
.the-list-content-item {
    display: inline-block;
    margin-left: 40px;
    vertical-align: middle;
    &--title{
      color: var(--el-text-color-placeholder);
    }
    &--content {
      color: var(--el-text-color-regular);
    }
    @media only screen and (max-width: 426px) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      &--title::after {
        content: ":";
        margin-left: 4px;
      }
    }
}
</style>