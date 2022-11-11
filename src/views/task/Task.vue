<template>
  <el-card class="m-b-16">
    <el-row :gutter="12" class="multiple-line-row">
      <el-col :xs="24" :sm="4" :xl="8">
        <el-button type="primary" icon="Plus" @click="showForm">{{ $t("button.newTask") }}</el-button>
      </el-col>
      <el-col :xs="24" :sm="12" :xl="4">
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
      <el-col :xs="24" :sm="12" :xl="4">
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
            :label="$t(`task.step.${key}`)"
          />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" :xl="4">
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
      <el-col :xs="24" :sm="8" :xl="4">
        <el-input 
          prefix-icon="Search"
          @change="getTaskList"
          :placeholder="$t('placeholder.search', { content: $t('task.searchField.name') })"
          v-model="taskQuery.taskname"
        />
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-scrollbar height="780px">
      <el-row :gutter="32">
        <el-col
          v-for="task in taskList"
          :key="task.taskid"
          :xs="24"
          :sm="8"
          :lg="6"
          :xl="4"
        >
          <TheProjectCard
            :title="task.taskname"
            :description="task.starttime"
            iconColor="#faad14"
            icon="SetUp"
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
              <div :class="['status-tag', `status-tag--${statusTag[task.status].tag}`]">
                {{ $t(`task.status.${task.status}`) }}
              </div>
            </template>
            <div style="margin-left: -28px">
              <div class="type-icon">
                <el-icon v-if="task.tasktype.includes('预处理')" :color="statusTag[task.status].color">
                  <IconFilter/>
                </el-icon>
                <el-icon v-if="task.tasktype.includes('数据分析')" :color="statusTag[task.status].color">
                  <IconAnalysis/>
                </el-icon>
              </div>
              <div class="text-center m-t-8">
                  {{ task.tasktype }}
              </div>
            </div>
          </TheProjectCard>
        </el-col>
      </el-row>
      <div class="load-more-btn" v-if="loadmore">
          <el-button type="danger" @click="getTaskList('more')" :loading="loading">{{$t("button.load")}}{{$t("button.more")}}</el-button>
      </div>
    </el-scrollbar>
    <TaskForm v-model="showTaskForm"/>
  </el-card>
</template>
<script setup>
import TheTr from '@/components/TheTr.vue';
import { getImgUrl } from '@/utils/common';
import { useRouter } from 'vue-router';
import TheIconImg from '@/components/TheIconImg.vue';
import { onMounted, ref } from "vue";
import TaskForm from './forms/TaskForm.vue';
import TheProjectCard from '@/components/TheProjectCard.vue';
import { taskByPageApi, delTask } from '@/api/task';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUtils } from '@/compositions/useUtils';
import IconFilter from "@/components/icons/IconFilter.vue";
import IconAnalysis from "@/components/icons/IconAnalysis.vue";
import IconHourGlassProcess from "@/components/icons/IconHourGlassProcess.vue";
import IconTask from "@/components/icons/IconTask.vue";

const router = useRouter();
console.log('router', router)

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
  filter: "滤波",
  analysis: "数据分析",
  fa: "滤波/数据分析"
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
  const res = await taskByPageApi(taskQuery.value);
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
      await delTask(taskid);
      ElMessage.success(`${i18n.t("button.delete")}${i18n.t("status.success")}`);
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