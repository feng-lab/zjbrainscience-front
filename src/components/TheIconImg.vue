<template>
  <el-icon :color="iconColor" :size="imgSrc? null:size" :class="{'is-loading': loading}">
    <component :is="icon" v-if="icon"/>
    <img :src="imgSrc" v-else :style="imgStyle"/>
  </el-icon>
</template>
<script setup>
defineProps({
  icon: String,
  iconColor: String,
  imgSrc: String,
  size: {
    type: Number, 
    default: 14
  },
  imgStyle: {
    type: Object,
    default: {
      height: '100%'
    }
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>