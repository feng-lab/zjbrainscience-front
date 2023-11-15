<template> 
<div 
  @drop="dropHandler" 
  @dragover="dragoverHandler"
  @dragleave="dragleaveHandler"
>
  <slot/>
</div>
</template>
<script setup>
const emits = defineEmits(["dropDone"])
const dragoverHandler = (e) => {
  e.preventDefault();
  e.target.className= "drop-over";
}
const dropHandler = (e) => {
  e.target.className = "";
  emits("dropDone", e);
}
const dragleaveHandler = (e) => {
  e.target.className = "";
}
</script>
<style lang="scss">
.drop-over {
  filter: brightness(0.7);
}
</style>