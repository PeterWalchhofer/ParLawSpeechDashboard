"use client";
import _ from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { BLACK } from "../modules/constants";
import { DateFilterType, FrequencyData } from "../modules/types";
import { useApexChart } from "../modules/useApexCharts";

type SpeechChartProps = {
  keywordResponse: FrequencyData[];
  dateFilter: DateFilterType;
  setDateFilter: (dateFilter: DateFilterType) => void;
  minYear?: Date;
  maxYear?: Date;
};
export default function SpeechChart2({
  keywordResponse,
  dateFilter,
  setDateFilter,
  minYear,
  maxYear,
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
  console.log(dateFilter);
  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      series: [{ name: "Word Frequency", data: keywordData }],
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
        height: 280,
        width: 500,
        type: "line",
        background: BLACK,
        id: "germany",
        brush: {
          target: "germany",
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

            const fromDate = new Date(min);
            const toDate = new Date(max);

            if (fromDate.getFullYear() === toDate.getFullYear()) debugger;
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
    [keywordData, dateFilter, handleDebouncedSelection]
  );
  const { elRef } = useApexChart(options);
  console.log("rerender");

  useEffect(() => {
    console.log("rerendersssss");
  }, [keywordData, dateFilter, handleDebouncedSelection]);

  return (
    <div ref={elRef}></div>
    // <Chart
    //   height={280}
    //   width={500}
    //   type="line"
    //   options={}
    //   series={[{ name: "Word Frequency", data: keywordData }]}
    // />
  );
}
