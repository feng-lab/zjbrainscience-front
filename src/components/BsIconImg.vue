<template>
  <el-icon :color="iconColor" :size="size" :class="{'is-loading': loading}" v-if="icon">
    <component :is="icon"/>
  </el-icon>
  <img :src="imgSrc" v-else :style="imgStyle"/>
</template>
<script setup>
const props = defineProps({
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