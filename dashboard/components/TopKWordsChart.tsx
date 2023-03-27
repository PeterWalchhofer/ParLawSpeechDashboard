import { upperFirst } from "lodash";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { BLACK } from "../modules/constants";
import { TFIDFResponse } from "../modules/types";

type TopKWordsChartProps = {
  topKResponse: TFIDFResponse;
};
export default function TopKWordsChart({ topKResponse }: TopKWordsChartProps) {
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  const values = useMemo(
    () => topKResponse.map((item) => item[1]),
    [topKResponse]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        categories: topKResponse.map((item) => upperFirst(item[0])),
      },

      theme: { mode: "dark", palette: "palette3" },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(3);
          },
        },
        title: {
          text: "TF-IDF",
          // offsetX: 30,
        },
      },

      chart: {
        type: "bar",
        background: BLACK,
        id: "germany",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
    }),
    [topKResponse]
  );

  return (
    <div>
      <Chart
        type="bar"
        height={280}
        width={500}
        options={options}
        series={[{ name: "TF-IDF", data: values }]}
      />
    </div>
  );
}
