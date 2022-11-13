import { ref } from "vue";
import { targetFilesApi } from "@/api/files";

export function useTargetFiles() {
    const source = ref([]);
    const visible = ref(false);
    const selectFile = ref([]);

    const handleSelect = async () => {
        source.value = await targetFilesApi();
        visible.value = true;
    }

    return {
        source,
        visible,
        selectFile,
        handleSelect
    }

}