<template>
  <div v-if="modelValue.length">
  <el-scrollbar  :max-height="height">
    <slot></slot>
    <div class="load-more-btn" v-if="loadMore">
      <el-button :type="type" @click="handleLoadMore(true)" :loading="loading">
        {{ $t("button.loadMore") }}
      </el-button>
    </div>
  </el-scrollbar> 
      </div>
  <el-empty v-else/>
  
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: []
  },
  type: {
    type: String,
    default: "danger"
  },
  loadMethod: Function,
  query: Object,
  limit: {
    type: Number,
    default: 10
  },
  height: {
    type: [String, Number],
    default: "var(--brain-body-scroll-height)"
  }
})

const emits = defineEmits(["update:modelValue"]);

const loading = ref(false);
const loadMore = ref(true);

let offset = 0;

const params = computed(() => ({
  ...props.query,
  limit: props.limit,
}))

const handleLoadMore = async (more) => {
  loading.value = true;
  if(more) {
    offset = props.modelValue.length;
  }
  const res = await props.loadMethod({
    ...params.value,
    offset
  });
  const newList = res.items ?? res;
  loading.value = false;
  if( newList?.length < props.limit ) {
    loadMore.value = false;
  }
  const list = more ? [...props.modelValue, ...newList] : newList;
  emits("update:modelValue", list);
  offset = 0;
}

defineExpose({
  handleLoadMore
})

onMounted(() => {
  handleLoadMore();
})


watch(params, () => {
  handleLoadMore();
}, { 
   deep: true
});

</script>