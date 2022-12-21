import { ref } from "vue";

export function useLoadmore(loadMethod) {
  const loading = ref(false);
  const loadMore = ref(true);
  const list = ref([]);
  const handleLoadMore = async () => {
    loading.value = true;
    if(loadMore)

  }

}