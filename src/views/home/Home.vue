<template>
  <el-row :gutter="8" class="multiple-line-row">
    <el-col :xs="24" :sm="12" :md="6">
      <bs-info-card
        :title="$t('term.experiment')"
        :info="statistic.experiments"
        :img-src="ExperimentImg"
      />
    </el-col>
    <el-col :xs="24" :sm="12" :md="6">
      <bs-info-card
        :title="$t('term.file')"
        :info="statistic.files"
        :img-src="FileImg"
      />
    </el-col>
    <el-col :xs="24" :sm="12" :md="6">
      <bs-info-card
        :title="$t('term.subject')"
        :info="statistic.human"
        :img-src="SickImg"
      />
    </el-col>
    <el-col :xs="24" :sm="12" :md="6">
      <bs-info-card
        :title="$t('term.task')"
        :info="statistic.taskmaster"
        :img-src="TaskImg"
      />
    </el-col>
  </el-row>
  <el-row :gutter="8" class="multiple-line-row">
    <el-col :xs="24" :sm="12" :md="8">
      <el-card shadow="hover" :header="$t('home.charts.dataType')">
        <bs-charts-pie
          :data="dataType" 
          style="height:300px"
          :series="{
            selectedMode: 'single'
          }"
        />
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8">
      <el-card shadow="hover" :header="$t('home.charts.subject')">
        <bs-charts-bar :dataset="subject" style="height:300px" stack="total"/>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8">
      <el-card shadow="hover" :header="$t('home.charts.server')">
        <bs-charts-liquid :data="server" style="height: 300px"/>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :md="8">
      <el-card shadow="hover" :header="$t('home.charts.sick')">
        <bs-charts-bar
          style="height: 300px"
          :dataset="sickInfo"
        />
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="16">
      <el-card shadow="hover">
        <template #header>
          <div class="between-flex data-growth-header">
            <span>{{ $t('home.charts.dataGrowth') }}</span>
            <span class="extra">
            <el-date-picker
              size="small"
              v-model="viewCycle"
              type="daterange"
              unlink-panels
              value-format="YYYY-MM-DD"
              range-separator="-"
              :start-placeholder="$t('label.startTime')"
              :end-placeholder="$t('label.endTime')"
              :shortcuts="shortcuts"
              @change="getDataGrowth"
            />
            </span>
          </div>
        </template>

        <bs-charts-line
          style="height: 300px" 
          area
          :option="{
            xAxis: {
              type: 'time',
              boundaryGap: false,
              axisLabel: {
                formatter: '{yyyy}-{MM}-{dd}'
              }
            },
            yAxis: {
              name: '数据总量（GB）',
              nameLocation: 'middle',
              nameGap: 45,
              type: 'value',
              boundaryGap: [0, '100%']
            },
          }"
          :data="dataGrowth"
          :series="{
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#5b8ff9' // 0% 处的颜色
                }, {
                    offset: 1, color: '#f0f5fe' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }"
        />
      </el-card>
    </el-col>

  </el-row>
</template>
<script setup>
import ExperimentImg from "@/assets/img/experiment.svg";
import FileImg from "@/assets/img/file.svg";
import SickImg from "@/assets/img/sick.svg";
import TaskImg from "@/assets/img/task.svg";
import BsInfoCard from '@/components/BsInfoCard.vue';
import BsChartsPie from "@/components/charts/BsChartsPie.vue";
import BsChartsBar from "@/components/charts/BsChartsBar.vue";
import BsChartsLine from "@/components/charts/BsChartsLine.vue";
import BsChartsLiquid from "@/components/charts/BsChartsLiquid.vue";

import { onMounted, onUnmounted, ref } from "vue";
import { useShortcuts } from "@/compositions/useShortcuts";
import { 
  statisticApi, 
  dataTypeApi, 
  subjectApi,
  serverIdleApi,
  sickInfoApi,
  dataGrowthApi
} from "@/api/home";

const { shortcuts } = useShortcuts();
const getDataSet = (data) => {
  const dataset = {
    dimensions: [],
    source: []
  };
  if(data && data.length) {
    dataset.dimensions = Object.keys(data[0]);
    dataset.source = data;
  }
  return dataset;
}

const viewCycle = ref(shortcuts.value[0].value());

const statistic = ref({
  experiments: 0,
  files: 0,
  human: 0,
  taskmaster: 0,
})

const dataType = ref([]);
const subject = ref(getDataSet([]));
const server = ref(0);

const sickInfo = ref(getDataSet([]));
const dataGrowth = ref();

let timer = null;
onMounted(() => {
  getStatistic();
  getDataType();
  getSubject();
  getServer();
  getSick();
  getDataGrowth();
  timer = setInterval(getServer, 5000);
})

onUnmounted(() => {
  clearInterval(timer);
})


const getStatistic = async () => {
  statistic.value = await statisticApi();
}

const getDataType = async () => {
  dataType.value = await dataTypeApi();
  dataType.value[0].selected = true;
}

const getSubject = async () => {
  const res = await subjectApi();
  subject.value = getDataSet(res);
}

const getServer = async () => {
  server.value = await serverIdleApi() / 100;
}

const getSick = async () => {
  const res = await sickInfoApi();
  sickInfo.value = getDataSet(res);
}

const getDataGrowth = async () => {
  const [ start, end ] = viewCycle.value;
  dataGrowth.value = await dataGrowthApi(start, end);
}

const data1 = ref([
  { value: 335, name: "Direct" },
  { value: 310, name: "Email" },
  { value: 234, name: "Ad Networks" },
  { value: 135, name: "Video Ads" },
  { value: 1548, name: "Search Engines" }
])

const dataset = {
  dimensions: ["sex", "30岁以下", "30岁到60岁之间", "60岁以上"],
  source: [
    {sex: "男性", "30岁以下": 5, "30岁到60岁之间": 5, "60岁以上": 3},
    {sex: "女性", "30岁以下": 9, "30岁到60岁之间": 2, "60岁以上": 7}
  ]
}

let base = +new Date(1988, 9, 3);
let oneDay = 24 * 3600 * 1000;
let data2 = [[base, Math.random() * 300]];
for (let i = 1; i < 20000; i++) {
  let now = new Date((base += oneDay));
  data2.push([+now, Math.round((Math.random() - 0.5) * 20 + data2[i - 1][1])]);
}

const data3 = [150, 230, 224, 218, 135, 147, 260];
const dataset2 = {
  dimensions: ["sick", "单位1", "单位2", "单位3"],
  source: [
    {sick: "癫痫", "单位1": 107, "单位2": 133, "单位3": 93},
    {sick: "睡眠障碍", "单位1": 31, "单位2": 156, "单位3": 14},
    {sick: "老年痴呆", "单位1": 5, "单位2": 92, "单位3": 454},
    {sick: "中风", "单位1": 23, "单位2": 48, "单位3": 32},
    {sick: "其他", "单位1": 2, "单位2": 6, "单位3": 34},
  ]

}
</script>
<style lang="scss" scoped>
.data-growth-header {
  @media only screen and (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
  }
}
</style>