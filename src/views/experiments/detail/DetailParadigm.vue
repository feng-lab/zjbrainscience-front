<template>
  <el-row class="m-b-16">
    <el-col :span="24">
      <el-button type="primary" icon="Plus" @click="addParadigm">{{ $t("button.newParadigm") }}</el-button>
    </el-col>
  </el-row>
  <el-empty v-if="!paradigmList.length"/>
  <el-scrollbar height="580px" v-else>  
    <el-card 
      :header="showDetail ? '实验范式列表': ''" 
      :shadow="showDetail ? 'always' : 'never'"
      :class="showDetail ? '': 'list'"
      :body-style="showDetail ? {}: {padding: 0}"
    >
      <bs-list>
        <bs-list-item
          v-for="paradigm in paradigmList"
          :key="paradigm.id"
          :title="`${$t('paradigm.text')} - ${paradigm.id}`"
          :description="paradigm.desc"
          :actions="[{
            text: $t('button.edit'),
            onClick: () => handleEdit(paradigm.id)
          }, {
            text: $t('button.delete'),
            onClick: () => handleDelete(paradigm.id)
          }]"
        >
          <template #avatar>
            <el-icon color="#faad14"><Histogram/></el-icon>
          </template>
          <bs-list-item-content
            title="创建人"
            content="wynne"
          />
          <bs-list-item-content
            title="创建时间"
            content="2022-10-20 15:00:00"
          />
        </bs-list-item>
      </bs-list>
    </el-card>
  </el-scrollbar>
  <form-paradigm
    v-model="showParadigm" 
    :paradigm-id="editParadigm"
    @form-closed="handleClose"
  />
</template>
<script setup>
import BsList, { BsListItem, BsListItemContent } from "@/components/list";
import FormParadigm from "../forms/FormParadigm.vue";

import { inject, onMounted, ref } from "vue";
import { paradigmsByExApi, deleteParadigmApi } from "@/api/experiments";
import { useUtils } from "@/compositions/useUtils";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const paradigmList = ref([]);

const activeParadigm = ref([]);
const experimentid = inject("exid");
const editParadigm = ref();
const { systemConfirm } = useUtils();
const showDetail = ref(false);

const i18n = useI18n();
onMounted(() => {
  loadParadigms();
})

const loadParadigms = async () => {
  paradigmList.value = await paradigmsByExApi(experimentid);
}

const showParadigm = ref(false);

const addParadigm = () => {
  showParadigm.value = true;
}

const handleEdit = (id) => {
  showParadigm.value = true;
  editParadigm.value = id;
}

const handleClose = (reload) => {
  editParadigm.value = null;
  if(reload) {
    loadParadigms();
  }
}

const handleDelete = (id) => {
  systemConfirm(
    i18n.t("paradigm.deleteConfirm", { id }),
    async () => {
      await deleteParadigmApi(experimentid, id);
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
      loadParadigms();
    }
  )

}

</script>
<style lang="scss" scoped>
.list.el-card {
  border: none;
}

.paradigm-list {
  list-style: none;
  padding-left: 0;
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 16px 0px;
    &--meta {
      display: flex;
      flex: 1 1;
      align-items: center;
      justify-content: flex-start;
      max-width: 100%;
      &--avatar {
        margin-right: 16px;
        font-size: 24px;
      }
      &--content {
        cursor: pointer;
        flex: 1 0;
        width: 0;
        &--title {
          margin-bottom: 4px;
        }
        &--desc {
          color: var(--el-text-color-secondary);
        }
      }
    }
    &--content {
      display: flex;
      &--item {
        display: inline-block;
        margin-left: 40px;
        vertical-align: middle;
        span {
          color: var(--el-text-color-regular);
        }
        p {
          color: var(--el-text-color-placeholder);
        }
      }
    }
    &--actions {
      flex: 0 0 auto;
      margin-left: 48px;
      padding: 0px;
    }
  }
}

</style>