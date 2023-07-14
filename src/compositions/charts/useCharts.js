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

import { useLine } from "./useLine";
import { useSunburst } from "./useSunburst";
import { useGraph } from "./useGraph";

const chartHandler = {
  "line": useLine,
  "sunburst": useSunburst,
  "graph": useGraph
};



export function useCharts(props) {
  const { 
    title="",
    chartType="bar",
  } = props;

  const { components=[], option:typeO={} } = chartHandler[chartType](props);


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
    ...components
  ]);
  const i18n = useI18n();

  const chartRef = ref();

  const option = computed(() => {

    const { legend, title: typeTitle, toolbox={}, ...otherTypeO } = typeO.value;
    const { feature, otherToolbox } = toolbox;

    return {
      legend: {
        bottom: "bottom",
        ...legend
      },
      title: {
        text: title,
        left: "center",
        show: title || typeTitle?.text,
        ...typeTitle
      },
      tooltip: {},
      toolbox: {
        feature: {
          saveAsImage: {
            title: i18n.t("label.saveImg")
          },
          ...feature
        },
        ...otherToolbox
      },
      ...otherTypeO
    }
  });


  return {
    chartRef,
    option
  }

}