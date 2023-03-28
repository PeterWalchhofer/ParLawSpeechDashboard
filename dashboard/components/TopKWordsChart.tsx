import { capitalize } from "lodash";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { BLACK } from "../modules/constants";
import { TFIDFResponse } from "../modules/types";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
type TopKWordsChartProps = {
  topKResponse: TFIDFResponse;
  yAxisRight?: boolean;
};
export default function TopKWordsChart({
  topKResponse,
  yAxisRight,
}: TopKWordsChartProps) {
  const values = useMemo(
    () => topKResponse.map((item) => ({ x: capitalize(item[0]), y: item[1] })),
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
      yaxis: {
        reversed: yAxisRight,
      },

      theme: { mode: "dark", palette: "palette3" },
      xaxis: {
        // labels: {
        //   formatter: function (val: number) {
        //     return val.toFixed(3);
        //   },
        // },
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
          horizontal: true,
        },
      },
    }),
    [topKResponse]
  );

  return (
    <div>
      <Chart
        type="bar"
        height={400}
        width={500}
        options={options}
        series={[{ name: "TF-IDF", data: values }]}
      />
    </div>
  );
}
