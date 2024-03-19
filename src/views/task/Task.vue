<template>
  <el-card class="m-b-16">
    <el-row :gutter="12" class="multiple-line-row">
      <el-col :xs="24" :sm="4" :md="8">
        <el-button type="primary" icon="Plus" @click="showForm">{{ $t("button.newTask") }}</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :md="4">
        <el-date-picker
          type="date"
          style="width: 100%"
          v-model="taskQuery.starttime"
          @change="getTaskList"
          class="col-right-btn" 
          value-format="YYYY-MM-DD"
          :placeholder="$t('task.selectField.time')"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="4">
        <el-select
          style="width: 100%"
          v-model="taskQuery.tasktype"
          clearable
          @change="getTaskList"
          :placeholder="$t('task.selectField.type')"
        >
          <el-option
            v-for="(value, key) in taskType"
            :key="key"
            :value="value"
            :label="$t(`task.type.${key}`)"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :md="4">
        <el-select
          style="width: 100%"
          v-model="taskQuery.status"
          clearable
          @change="getTaskList"
          :placeholder="$t('task.selectField.status')"
        >
          <el-option 
            v-for="(status, index) in 3" 
            :key="status"
            :value="index"
            :label="$t(`task.status.${index}`)"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="8" :md="4">
        <el-input 
          prefix-icon="Search"
          @change="getTaskList"
          :placeholder="$t('placeholder.search', { content: $t('task.searchField.name') })"
          v-model="taskQuery.name"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-scrollbar height="780px" v-if="taskList.length">
      <el-row :gutter="32">
        <el-col
          v-for="task in taskList"
          :key="task.taskid"
          :xs="24"
          :sm="8"
          :lg="6"
          :xl="4"
        >
          <bs-project-card
            :title="task.name"
            :description="task.starttime"
            icon-color="#faad14"
            icon="SetUp"
            :descStyle="{
              textAlign: 'center'
            }"
            :buttons="[{
              text: $t('button.detail'),
              icon: 'View',
              onClick: () => handleView(task.taskid)
            }, {
              text: $t('button.delete'),
              icon: 'Delete',
              onClick: () => handleDelete(task.taskid, task.taskname)
            }]"
          >
            <template #extra> 
              <el-tag :type="statusTag[task.status].tag">
                <el-icon class="is-loading" v-if="task.status === '1'"><Loading/></el-icon>
                {{ $t(`task.status.${task.status}`) }}
              </el-tag>
            </template>
            <div>
              <div class="type-icon">
                <el-icon v-if="task.tasktype.includes('Filter')" :color="statusTag[task.status].color">
                  <bs-icon-filter/>
                </el-icon>
                <el-icon v-if="task.tasktype.includes('Analysis')" :color="statusTag[task.status].color">
                  <bs-icon-analysis/>
                </el-icon>
              </div>
              <div class="text-center m-t-8">
                  {{ task.tasktype }}
              </div>
            </div>
          </bs-project-card>
        </el-col>
      </el-row>
      <div class="load-more-btn" v-if="loadmore">
          <el-button type="danger" @click="getTaskList('more')" :loading="loading">{{$t("button.load")}}{{$t("button.more")}}</el-button>
      </div>
    </el-scrollbar>
    <el-empty v-else/>
    <task-form v-model="showTaskForm" @reload-task="getTaskList"/>
  </el-card>
</template>
<script setup>
import BsIconFilter from "@/components/icons/BsIconFilter.vue";
import BsIconAnalysis from "@/components/icons/BsIconAnalysis.vue";
import TaskForm from './forms/TaskForm.vue';
import BsProjectCard from '@/components/BsProjectCard.vue';

import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { taskByPageApi, deleteTaskApi } from '@/api/task';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUtils } from '@/compositions/useUtils';
import useTask from "@/stores/task";

const router = useRouter();

const showTaskForm = ref(false);
const i18n = useI18n();
const { systemConfirm } = useUtils();
const statusTag = {
  "0": { tag: "info", color: "#bfbfbf" }, 
  "1": { tag: "blue", color: "#1890ff"},
  "2": { tag: "success", color: "#52c41a"} , 
};

const loadmore = ref(true);
const loading = ref(false);

const taskType = {
  Filter: "Filter",
  Analysis: "Analysis",
  'Filter/Analysis': "Filter/Analysis"
}

const taskList = ref([]);


const taskQuery = ref({
  taskname: "",
  starttime: "",
  tasktype: "",
  status: "",
  offset: 0,
  limit: 12 
})

onMounted(() => {
  getTaskList();
})

const getTaskList = async (more) => {
  loading.value = true;
  if(more) {
    taskQuery.value.offset = taskList.value.length;
  }
  //const res = await taskByPageApi(taskQuery.value);
  const { taskList:res } = useTask();
  loading.value = false;
  taskList.value = res;
  if(res.length < taskQuery.value.limit) {
    loadmore.value = false;
  }
  taskList.value = more ? [...taskList.value, ...res ] : res;
  taskQuery.value.offset = 0;
}


const handleView = (taskid) => {
  router.push(`/task/${taskid}`);
}

const handleDelete = (id, name) => {
  systemConfirm(
    i18n.t("task.deleteConfirm", { id, name}),
    async () => {
      await deleteTaskApi(taskid);
      ElMessage.success(i18n.t("elmessage.deleteSuccess"));
      getTaskList();
    }
  )
}

const showForm = () => {
  showTaskForm.value = true;
}

</script>

<style lang="scss" scoped>
.type-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 64px;
}

.status-tag {
  width: 100px; 
  height: 100px;
  position: absolute;
  background: var(--el-color-primary);
  color: #fff;
  right: -75px;
  top: -68px;
  transform: rotate(45deg);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  &--blue {
    background: var(--el-color-blue);
  }
  &--info {
    background: var(--el-color-info);
  }
}



</style>