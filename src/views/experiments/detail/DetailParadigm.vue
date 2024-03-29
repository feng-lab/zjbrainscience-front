<template>
  <el-row class="m-b-16">
    <el-col :span="24">
      <el-button 
        type="primary" 
        icon="Plus" 
        @click="() => handleShowForm()" 
        v-if="user.access_level > 10"
      >{{ $t("button.newParadigm") }}</el-button>
    </el-col>
  </el-row>
    <el-card 
      shadow="never"
      class="list"
      :body-style="{padding: 0}"
    >
      <bs-load-more 
        ref="loadMoreRef"
        height="600px"
        :limit="6"
        :load-method="paradigmsByExApi"
        v-model="paradigmList"
        :query="query"
      >
      <bs-list>
        <bs-list-item
          v-for="paradigm in paradigmList"
          :key="paradigm.id"
          :title="`${$t('paradigm.text')} - ${paradigm.id}`"
          :description="paradigm.description"
          :actions="[{
            text: $t('button.edit'),
            onClick: () => handleShowForm(paradigm.id)
          }, {
            text: $t('button.delete'),
            onClick: () => handleDelete(paradigm.id)
          }]"
        >
          <template #avatar>
            <el-icon color="#faad14"><Histogram/></el-icon>
          </template>
          <bs-list-item-content
            :title="$t('paradigm.creator')"
            :content="paradigm.creator.username"
          />
          <bs-list-item-content
            :title="$t('paradigm.createTime')"
            :content="paradigm.gmt_create"
          />
        </bs-list-item>
      </bs-list>
      </bs-load-more>
    </el-card>
  <form-paradigm
    v-model="showForm" 
    v-model:cu-id="itemId"
    @submit-success="handleSubmitSuccess"
  />
</template>
<script setup>
import BsList, { BsListItem, BsListItemContent } from "@/components/list";
import FormParadigm from "../forms/FormParadigm.vue";
import BsLoadMore from "@/components/BsLoadMore.vue";

import { inject, ref } from "vue";
import { paradigmsByExApi, deleteParadigmApi } from "@/api/paradigm.js";
import { useUtils } from "@/compositions/useUtils";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import useUserStore from "@/stores/user";
import { useShowForm } from "@/compositions/useShowForm";

const paradigmList = ref([]);

const experimentid = inject("exid");
const { user } = useUserStore();
const loadMoreRef = ref();
const query = {
  experiment_id: experimentid
}
const { systemConfirm } = useUtils();
const { showForm, itemId, handleShowForm } = useShowForm();

const i18n = useI18n();

const loadParadigms = async () => {
  paradigmList.value = await paradigmsByExApi(experimentid);
}

const handleDelete = (id) => {
  systemConfirm(
    i18n.t("paradigm.deleteConfirm", { id }),
    async () => {
      await deleteParadigmApi(id);
      ElMessage.success(i18n.t("elmessage.deleteSuccess"));
      loadMoreRef.value.handleLoadMore();
    }
  )
}

const handleSubmitSuccess = () => {
  loadMoreRef.value.handleLoadMore();
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