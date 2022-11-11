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

        <ul class="paradigm-list">
          <li
            v-for="paradigm in paradigmList"
            :key="paradigm.id"
            class="paradigm-list-item"
          >
            <div class="paradigm-list-item--meta">
              <div class="paradigm-list-item--meta--avatar"> 
                <el-icon color="#faad14"><Histogram/></el-icon>
              </div>
              <div class="paradigm-list-item--meta--content" @click="handleEdit(paradigm.id)"> 
                <h4 class="paradigm-list-item--meta--content--title">
                  {{$t('paradigm.text')}} - {{ paradigm.id }}
                </h4>
                <span class="paradigm-list-item--meta--content--desc">
                  {{ paradigm.desc }}
                </span>
              </div>
            </div>
            <div class="paradigm-list-item--content">
              <div class="paradigm-list-item--content--item" > 
                <span>创建人</span>
                <p>wynne</p>
              </div>
              <div class="paradigm-list-item--content--item" > 
                <span>创建时间</span>
                <p>2022-10-20 15:00:00</p>
              </div>
            </div>
            <div class="paradigm-list-item--actions">
              <el-button size="small" link type="primary" @click="handleDelete(paradigm.id)">{{$t("button.delete")}}</el-button>
              <el-divider direction="vertical"/>
              <el-button size="small" link type="primary" @click="handleEdit(paradigm.id)">{{$t("button.edit")}}</el-button>
            </div>
          </li>
        </ul>
    </el-card>
  </el-scrollbar>
  <FormParadigm 
    v-model="showParadigm" 
    :paradigm-id="editParadigm"
    @formclosed="handleClose"
  />
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import FormParadigm from "../forms/FormParadigm.vue";
import { paradigmsByExApi, delParadigmApi } from "@/api/experiments";
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
    i18n.t("paradigm.deleteConfirm"),
    async () => {
      await delParadigmApi(experimentid, id);
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