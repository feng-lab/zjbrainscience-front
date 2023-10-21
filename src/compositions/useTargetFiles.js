import { ref } from "vue";
import { filesByPageApi, targetFilesApi } from "@/api/files";
import { allExByPageApi } from "@/api/experiments";

export function useTargetFiles() {
    const source = ref([]);
    const visible = ref(false);
    const selectFiles = ref([]);
    const selectFile = ref();

    const loadSource = async () => {
        //source.value = await targetFilesApi();
        const exps = await allExByPageApi({limit: 30});
        for(let exp of exps) {
            const { id:experiment_id } = exp;
            const { items } = await filesByPageApi({ experiment_id, limit: 30});
            items.forEach(file => {
                source.value.push({
                    id: file.id,
                    filename: file.name,
                    filetype: file.file_type,
                    experimentsid: experiment_id,
                    size: file.size
                })
            })
        }
    }

    return {
        source,
        visible,
        selectFile,
        selectFiles,
        loadSource
    }

}