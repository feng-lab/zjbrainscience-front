import { LineChart } from "echarts/charts";
import {
  GridComponent,
  DatasetComponent
} from "echarts/components";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

export function useLine(props) {

  const area = props?.typeSpecificProps?.area;
  const i18n = useI18n();

  let series = {
    type: "line",
    ...props?.series
  }

  if(area) {
    series = { 
      ...series, 
      areaStyle: props?.series?.areaStyle ?? {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0, color: '#5470c6' // 0% 处的颜色
          }, {
              offset: 1, color: '#c6cfec' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
  }

  const option = computed(() => {
    const feature = {
      dataZoom: {
        title: {
          zoom: i18n.t("label.chartZoom"),
          back: i18n.t("label.chartZoomBack"),
        }
      },
      ...props.option?.toolbox.feature,
    }
    const o = {
      tooltip: {
        trigger: "axis",
      },
      xAxis: {},
      yAxis: {},
      series: series,
      ...props.option,
      toolbox: {
        ...props.option?.toolbox,
        feature,
      }
    }
    if(props.dataset) {
      o["dataset"] = props.dataset
    }
    if(props.data) {
      o.series.data = props.data
    }
    return o;
  })

  return {
    components: [ LineChart, GridComponent, DatasetComponent ],
    option
  }

}

