import { ref } from "vue";
import { targetFilesApi } from "@/api/files";

export function useTargetFiles() {
    const source = ref([]);
    const visible = ref(false);
    const selectFile = ref([]);

    const handleSelect = async () => {
        source.value = await targetFilesApi();
    }

    return {
        source,
        visible,
        selectFile,
        handleSelect
    }

}