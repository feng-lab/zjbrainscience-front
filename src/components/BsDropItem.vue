<template> 
<div 
  :data-tag="tag"
  @drop="dropHandler" 
  @dragover="dragOverHandler"
  @dragenter="dragEnterHandler"
  @dragend="dragEndHandler"
>
  <slot/>
</div>
</template>
<script setup>
const props = defineProps([ "tag", "carriedData", "dropHandler"]);
const emits = defineEmits(["dropDone"]);

const dragOverHandler = (e) => {
  e.preventDefault();
}

const clearDropSyle = () => {
  document.querySelectorAll(".drop-over").forEach(node => {
    node.classList.remove("drop-over");
  })
}

const getDropNode = (node) => {
  while(node) {
    if(node.dataset.tag) {
      return node;
    }
    node = node.parentNode;
  }

}
const dropHandler = (e) => {
  e.preventDefault()
  clearDropSyle();
  const dropNode = getDropNode(e.target);
  if(dropNode && dropNode.dataset.tag === props.tag) {
    let enableEmit = true;
    if(props.dropHandler) {
      enableEmit = props.dropHandler(e, props.carriedData);
    }
    enableEmit && emits("dropDone", e, props.carriedData);
  }
}

const dragEnterHandler = (e) => {
  e.preventDefault()
  clearDropSyle();
  const dropNode = getDropNode(e.target);
  if(dropNode && dropNode.dataset.tag === props.tag) {
    dropNode.classList.add("drop-over");
  }
}
const dragEndHandler= (e) => {
  clearDropSyle();
}

</script>
<style lang="scss">
.drop-over {
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
}
</style>