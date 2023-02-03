import { ref, watch } from "vue";
import { getUserApi } from "@/api/user";

export function useUserSearch(custom_options) {

  const options = custom_options ?? ref([]);
  const loading = ref(false);

  const handleRemoteSearch = (staff_id) => {
    if(staff_id) {
      loading.value = true;
      setTimeout(async ()=> {
        const { items=[] } = await getUserApi({staff_id: staff_id});
        options.value = items.map(user => ({
          value: user.id,
          label: `${user.username}(${user.staff_id})`
        }))
        loading.value = false;
      }, 200);
    } else {
      options.value = [];
    }
  }
  
  return {
    options,
    loading,
    handleRemoteSearch
  }
}