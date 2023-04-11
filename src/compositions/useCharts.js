import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  ToolboxComponent,
  AxisPointerComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
} from "echarts/components";

export function useCharts(title=null, otherComponens=[]) {
  use([
    CanvasRenderer,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DatasetComponent,
    ToolboxComponent,
    AxisPointerComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    ...otherComponens
  ]);
  const i18n = useI18n();

  const chartRef = ref();

  const initOption = computed(() => ({
    //color: ["#1890ff", "#2fc25b", "#facc14", "#f04864", "#13c2c2", "#8543e0", "#73c9e6", "#9dd96c", "#e6965c", "#d66bca"],
    //color: ["#5b8ff9", "#61ddaa", "#65789b", "#f6bd16", "#7262fd", "#78d3f8", "#9661bc", "#f6903d", "#008685", "#f08bb4"],
    //color: ["#5b8ff9", "#61ddaa", "#65789b", "#f6bd16", "#e86452", "#78d3f8", "#9661bc", "#f6903d", "#008685", "#f08bb4"],
    legend: {
      bottom: "bottom"
    },
    title: {
      text: title,
      left: "center",
      show: title
    },
    tooltip: {},
    toolbox: {
      feature: {
        saveAsImage: {
          title: i18n.t("label.saveImg")
        }
      }
    },
  }));


  return {
    chartRef,
    initOption,
  }

}