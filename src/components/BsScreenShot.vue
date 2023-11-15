<template>
  <bs-icon-img icon="Camera" class="screen-shot" @click="captureScreen"/>
  <div :class="['count-down', count ? 'active' : '']" v-if="count" >{{ count }}</div>
</template>
<script setup>
import html2canvas from "html2canvas";
import { onUnmounted, ref } from "vue";
const _getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(origFn) {
  return function(type, attribs) {
    attribs = attribs || {};
    attribs.preserveDrawingBuffer = true;
    return origFn.call(this, type, attribs);
  };
}(HTMLCanvasElement.prototype.getContext);

const props = defineProps({
  selector: {
    type: String,
    default: "body"
  },
  delay: {
    type: Number,
    default: 3
  },
  imageType: {
    type: String,
    default: "image/png"
  },
  quality: {
    type: Number,
    default: 1.0
  },
  download: {
    type: Boolean,
    default: true
  }
})

const count = ref(0);

const emits = defineEmits(["screenShot"])
async function captureScreen() {
  const screenShotEle = document.querySelector(props.selector);
  count.value = Math.round(props.delay);
  const timer = setInterval(() => {
    if(count.value === 0) {
      clearInterval(timer);
      html2canvas(screenShotEle).then(canvas => {
        emits("screenShot", canvas);
        if(props.download) {
          let result = canvas.toDataURL(props.imageType, props.quality);
          console.log('download')
          const downloadEle = document.createElement('a');
          downloadEle.href = result;
          downloadEle.download = "screenshot.png";
          downloadEle.style.display = "none";
          downloadEle.click();
          downloadEle.remove();
        }
      })
      return;
    }
    count.value -= 1;
  }, 1000);

  setTimeout(() => {
  }, delay * 1000);
}
onUnmounted(() => {
  HTMLCanvasElement.prototype.getContext = _getContext;
})
</script>
<style lang="scss" scoped>
.screen-shot {
  cursor: pointer;
}
.count-down {
  z-index: 999;
  position: absolute;
  top: 60px;
  right: -50px;
  font-size: 80px;
  color: var(--el-color-primary);
  width: 104px;
  height: 104px;
  line-height: 104px;
  background: rgba(255, 255, 255, 0.7);
  text-align: center;
  border-radius: 50%;
  overflow: hidden;
}
</style>