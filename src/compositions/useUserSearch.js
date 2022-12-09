import { ref, watch } from "vue";
import { getUserApi } from "@/api/user";

export function useUserSearch(custom_options) {

  const options = custom_options ?? ref([]);

  const handleRemoteSearch = (staff_id) => {
    if(staff_id) {
      setTimeout(async ()=> {
        const { items=[] } = await getUserApi({staff_id: staff_id});
        options.value = items.map(user => ({
          value: user.id,
          label: `${user.username}(${user.staff_id})`
        }))
      }, 200);
    } else {
      options.value = [];
    }
  }
  
  return {
    options,
    handleRemoteSearch
  }
}