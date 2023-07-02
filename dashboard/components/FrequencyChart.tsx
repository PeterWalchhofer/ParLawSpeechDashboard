"use client";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import {
  BLACK,
  BLUE,
  INDEX_LABELS,
  roundDateToYear,
} from "../modules/constants";
import { DateFilterType, FrequencyData, Index } from "../modules/types";
import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type FrequencyChartProps = {
  keywordResponse: FrequencyData[];
  dateFilter: DateFilterType;
  setDateFilter: (dateFilter: DateFilterType) => void;
  country: Index;
  showHelpAnnotation: boolean;
};
export default function FrequencyChart({
  keywordResponse,
  dateFilter,
  setDateFilter,
  country,
  showHelpAnnotation,
}: FrequencyChartProps) {
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
      colors: [BLUE],
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
      title: {
        text: "Frequency of keyword(s) over time",
        align: "center",
        style: {
          fontWeight: "normal",
          fontSize: "12px",
          color: "#ccc"
        }
      },
      annotations: {
        texts: [
          showHelpAnnotation
            ? {
                text: "⭰ Click and drag to filter ⭲",
                x: "50%",
                y: "30%",
                textAnchor: "middle",
                stroke: "#fff",
                fontSize: "14px",
              }
            : {},
        ],
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
    [dateFilter, handleDebouncedSelection, country, showHelpAnnotation]
  );

  return (
    <div style={{ position: "relative",  marginTop: "15px" }}>
      <div style={{ position: "absolute", top: 10, right: 20, zIndex: 100 }}>
        <Tooltip
          title={
            <p>
              Frequence of the keyword for {INDEX_LABELS[country].country} among
              parliamentary speeches. <br /> <br /> Select a time frame by
              dragging your mouse for further analysis{" "}
            </p>
          }
          placement="left"
        >
          <InfoOutlined />
        </Tooltip>
      </div>
      <Chart
        height={280}
        width={500}
        type="line"
        options={options}
        series={[{ name: "Word Frequency", data: keywordData }]}
      />
    </div>
  );
}
