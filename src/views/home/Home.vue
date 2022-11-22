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
      <el-card shadow="hover" :header="$t('home.charts.dataGrowth')">
        <el-row :gutter="12">
          <el-col :xs="24" :sm="12" :lg="7" :xl="{span: 4, offset: 8}" >
            <el-button class="date-control-button" @click="getDate['week']">{{ $t("datepicker.week")}}</el-button>
            <el-button class="date-control-button" @click="getDate['month']">{{ $t("datepicker.month")}}</el-button>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="7" :xl="4" >
            <el-button class="date-control-button" @click="getDate['halfofyear']">{{ $t("datepicker.halfofyear")}}</el-button>
            <el-button class="date-control-button" @click="getDate['year']">{{ $t("datepicker.year")}}</el-button>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="5" :xl="4">
            <el-date-picker
              v-model="start"
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :placeholder="$t('label.startTime')"
              :prefix-icon="BsIconStarttime"
              :disabled-date="(time) => time.getTime() > Date.now()"
            />
          </el-col>
          <el-col :xs="24" :sm="12" :lg="5" :xl="4">
            <el-date-picker
              type="date"
              v-model="end"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :placeholder="$t('label.endTime')"
              :prefix-icon="BsIconEndtime"
              :disabled-date="(time) => time.getTime() > Date.now()"
            />
          </el-col>
        </el-row>

        <bs-charts-line
          style="height: 258px" 
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
import BsIconStarttime from "@/components/icons/BsIconStarttime.vue";
import BsIconEndtime from "@/components/icons/BsIconEndtime.vue";

import { onMounted, onUnmounted, ref, watch } from "vue";
import { useShortcuts } from "@/compositions/useShortcuts";
import { 
  statisticApi, 
  dataTypeApi, 
  subjectApi,
  serverIdleApi,
  sickInfoApi,
  dataGrowthApi
} from "@/api/home";

const { start, end, getDate } = useShortcuts();
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

watch([start, end], () => {
  getDataGrowth()
})

const getDataGrowth = async () => {
  console.log('start', start.value)
  console.log('end', end.value)
  if(start.value && end.value) {
    if(start.value < end.value) {
      dataGrowth.value = await dataGrowthApi(start.value, end.value);
    } else {
      end.value = null;
    }
  }
}


</script>
<style lang="scss" scoped>
  .date-control-button {
    width: calc(50% - 6px);
  }
</style>