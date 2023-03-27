"use client";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { BLACK, roundDateToYear } from "../modules/constants";
import { DateFilterType, FrequencyData } from "../modules/types";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type SpeechChartProps = {
  keywordResponse: FrequencyData[];
  dateFilter: DateFilterType;
  setDateFilter: (dateFilter: DateFilterType) => void;
  country: string;
};
export default function SpeechChart({
  keywordResponse,
  dateFilter,
  setDateFilter,
  country,
}: SpeechChartProps) {
  const keywordData = useMemo(
    () =>
      keywordResponse.map((item) => ({
        x: item.date_year,
        y: item.n,
      })),
    [keywordResponse]
  );

  const handleDebouncedSelection = useCallback(
    _.debounce(
      (fromDate, toDate) =>
        setDateFilter({
          fromDate,
          toDate,
        }),
      500
    ),
    []
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      tooltip: {
        enabled: true,
        x: {
          show: true,
          format: "yyyy",
          formatter: undefined,
        },
      },
      yaxis: {
        show: true,
        axisBorder: {
          show: true,
          width: 0.2,
        },

        title: {
          text: "Frequency",
          // offsetX: 30,
        },
      },
      theme: { mode: "dark", palette: "palette3" },
      xaxis: {
        type: "datetime",
        axisBorder: {
          show: true,
          strokeWidth: 0.1,
        },
      },
      stroke: { width: 3, curve: "smooth" },
      markers: { size: 0.2 },
      grid: {
        show: true,
        position: "back",
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: true } },
      },
      chart: {
        type: "line",
        background: BLACK,
        id: country,
        brush: {
          target: country,
          enabled: true,
        },

        selection: {
          enabled: true,
          xaxis: {
            min: dateFilter.fromDate.getTime(), //_.max([dateFilter.fromDate.getTime(), minYear?.getTime()]),
            max: dateFilter.toDate.getTime(), //_.min([dateFilter.toDate.getTime(), maxYear?.getTime()]),
          },
          fill: {
            color: "#ccc",
            opacity: 0.4,
          },
        },

        zoom: {
          enabled: false,
        },

        events: {
          selection: (chartContext, { xaxis }) => {
            const { min, max } = xaxis;

            const fromDate = roundDateToYear(new Date(min));
            const toDate = roundDateToYear(new Date(max));
            if (
              fromDate.getFullYear() === dateFilter.fromDate.getFullYear() &&
              toDate.getFullYear() === dateFilter.toDate.getFullYear()
            ) {
              return;
            }
            // console.log(fromDate.getFullYear(), toDate.getFullYear());
            handleDebouncedSelection(fromDate, toDate);
          },
        },
      },
    }),
    [dateFilter, handleDebouncedSelection, country]
  );

  return (
    <Chart
      height={280}
      width={500}
      type="line"
      options={options}
      series={[{ name: "Word Frequency", data: keywordData }]}
    />
  );
}
