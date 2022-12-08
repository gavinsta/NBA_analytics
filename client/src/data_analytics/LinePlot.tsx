import React from "react";
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
import PlotParams from "react-plotlyjs-ts"
const Plot = createPlotlyComponent(Plotly);

export default function LineChart(plotParams: PlotParams) {
  const data = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      mode: "lines",
    },
  ];
  const layout = { title: "Chart Title" };

  return <Plot data={data} layout={layout} />;
}