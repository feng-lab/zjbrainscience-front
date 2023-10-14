<template>
    <div v-if="modelValue.length">
      <el-scrollbar :max-height="height" ref="scrollRef">
        <div ref="scrollViewRef">
          <slot></slot>
        </div>
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
import { ref, computed, watch, onMounted, nextTick } from "vue";

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

const emits = defineEmits(["update:modelValue", "loadCompleted"]);

const loading = ref(false);
const loadMore = ref(true);

const scrollRef = ref();
const scrollViewRef = ref();

let offset = 0;

const params = computed(() => ({
  ...props.query,
  limit: props.limit,
}))

const handleLoadMore = async (more, moreCnt) => {
  loading.value = true;
  if(more) {
    offset = props.modelValue.length;
    params.value.limit = moreCnt ?? props.limit;
  }
  const res = await props.loadMethod({
    ...params.value,
    offset,
  });
  const newList = res.items ?? res;
  const totalCnt = res?.total;
  const list = more ? [...props.modelValue, ...newList] : newList;
  loading.value = false;
  if(more) {
    nextTick(() => {
      scrollRef.value.setScrollTop(scrollViewRef.value.clientHeight + 48 - props.height) ;
    }) ;
  }
  loadMore.value = !(!moreCnt && newList?.length < props.limit || list.length === totalCnt);
  emits("update:modelValue", list);
  !loadMore.value && emits("loadCompleted");
  offset = 0;
}

defineExpose({
  handleLoadMore,
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