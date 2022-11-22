import { ref } from "vue";
import { targetFilesApi } from "@/api/files";

export function useTargetFiles() {
    const source = ref([]);
    const visible = ref(false);
    const selectFiles = ref([]);
    const selectFile = ref();

    const loadSource = async () => {
        source.value = await targetFilesApi();
    }

    return {
        source,
        visible,
        selectFile,
        selectFiles,
        loadSource
    }

}