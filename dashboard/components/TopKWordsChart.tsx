import { capitalize } from "lodash";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { BLACK, BLUE } from "../modules/constants";
import { TFIDFResponse } from "../modules/types";
import { Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
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
      colors: [BLUE],
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
      noData: {
        text: "No data",
        align: "center",
        verticalAlign: "middle",
      },
    }),
    [topKResponse]
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 20, zIndex: 100 }}>
        <Tooltip
          title={
            <p>
              This shows the most important words among the filtered speeches by
              the chosen keywords and time interval.
              <br />
              <br />
              <a href="https://wikipedia.org/wiki/Tf%e2%80%93idf" target="_blank" > TF-IDF</a> (term frequency–inverse document frequency) is one measure
              to determine the importance of a word in a document.
            </p>
          }
          placement="left"
        >
          <InfoOutlined />
        </Tooltip>
      </div>
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
