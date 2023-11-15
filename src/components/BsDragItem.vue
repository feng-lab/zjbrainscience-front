<template> 
<div draggable="true" @dragstart="dragstartHandler" class="drag-item">
  <slot/>
</div>
</template>
<script setup>
const props = defineProps({
  effect: {
    type: String,
    default: "copy"
  },
  data: Object,
  dragStartHandler: Function
})

const dragstartHandler = (e) => {
  e.dataTransfer.effectAllowed = props.effect;
  if(props.data) {
    for(let [type, value] of Object.entries(props.data)) {
      e.dataTransfer.setData(type, value);
    }
  }
  if(props.dragStartHandler) {
    props.dragStartHandler(e);
  }
}

</script>
<style lang="scss" scoped>
.drag-item {
  display: inline-block;
  & > * {
    cursor: unset;
  }
}

</style>
