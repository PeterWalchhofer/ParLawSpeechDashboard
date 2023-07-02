import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMiddlecatContext } from "../../amcat4react";
import { usePartyAggregation } from "../api/usePartyAggregation";
import { BLACK, PARTY_COLORS, PartyItem, hexToHsl } from "../modules/constants";
import { DateFilterType, Index } from "../modules/types";
import { InfoOutlined } from "@mui/icons-material";

type PartyStatisticsProps = {
  partyData: PartyItem[];
  index: Index;
  dateFilter: DateFilterType;
  selectedParty?: string;
  setSelectedParty: (party?: string) => void;
};
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function labelLineBreaks(str: string) {
  let label: string | string[] = str;
  if (str.length > 15 && str.includes("/")) {
    label = str.split(/(?<=\/)/);
  }

  if (typeof label === "string" && label.length > 15) {
    label = str.split(" ");
  }
  return label;
}

export function PartyStatistics({
  index,
  partyData,
  dateFilter,
  selectedParty,
  setSelectedParty,
}: PartyStatisticsProps) {
  const { user } = useMiddlecatContext();
  const [normalized, setNormalized] = useState<boolean>(false);
  const { data: totals } = usePartyAggregation({
    index,
    user,
    dateFilter,
  });
  const ref = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const values = useMemo(
    () =>
      partyData
        .map((item) => ({
          x: labelLineBreaks(item.party), // split including / to keep it. Array for line-break
          y: normalized
            ? item.n /
              (totals?.find((party) => party.party === item.party)?.n || 1)
            : item.n,
          party: item.party,
          fillColor: PARTY_COLORS[index][item.party],
        }))
        .sort((a, b) => {
          const lum_a = hexToHsl(a.fillColor)[2];
          const lum_b = hexToHsl(b.fillColor)[2];
          return lum_a - lum_b;
        }),
    [partyData, normalized, selectedItem]
  );

  const barWidth = parseFloat(
    ref.current
      ?.querySelector('path[barWidth]:not([value=""])')
      ?.getAttribute("barWidth") || "0"
  );

  const offset = barWidth * 0.43;
  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      fill: {
        opacity: 0.95,
      },
      title: {
        text: `Party share ${dateFilter.fromDate.getFullYear()} - ${dateFilter.toDate.getFullYear()} wrt. keyword(s)`,
        align: "center",
        style: {
          fontWeight: "normal",
          fontSize: "12px",
          color: "#ccc"
        }
    },

      theme: { mode: "dark", palette: "palette3" },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(normalized ? 2 : 0);
          },
        },
        title: {
          text: "# Speeches",
          // offsetX: 30,
        },
      },
      annotations: {
        xaxis: [
          // This is a bit hacky. Apexcharts does not allow to permanently enable crosshairs for indicating a selected bar.
          // Instead, we add a range annotation
          {
            ...(selectedItem !== null && {
              x: selectedItem * (barWidth + offset),
              x2: selectedItem * (barWidth + offset) + barWidth,
              offsetX: barWidth / 5,
            }),
          },
        ],
      },
      chart: {
        type: "bar",
        background: BLACK,
        id: "germany",
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
        },

        events: {
          dataPointSelection: (event, chartContext, config) => {
            const party = values[config.dataPointIndex].party;
            if (selectedParty === party) {
              setSelectedItem(null);
              setSelectedParty(undefined);
              return;
            }
            setSelectedParty(party);
          },
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          distributed: true,
        },
      },
      noData: {
        text: "No data",
        align: "center",
        verticalAlign: "middle",
      },
    }),
    [partyData, normalized, selectedItem, totals]
  );

  useEffect(() => {
    if (!selectedParty) {
      setSelectedItem(null);
    }
    setSelectedItem(values.findIndex((item) => item.party === selectedParty));
  }, [selectedParty]);

  return (
    <Grid2
      container
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid2 xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ToggleButtonGroup
            value={normalized}
            exclusive
            aria-label="outlined button group"
            onChange={() => setNormalized((prev) => !prev)}
            size="small"
            style={{ paddingLeft: 15 }}
          >
            <ToggleButton value={true}>Norm</ToggleButton>
            <ToggleButton value={false}>Total</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip
            title={
              <p>
                This chart shows the share of speeches per party. <br />
                Click on a bar to investigate the speeches of a party in detail.{" "}
                <br />
                <br />
                <br />
                <b>TOTAL:</b> The total number of speeches per party is shown.{" "}
                <br />
                <b>NORM:</b> The share of speeches per party is normalized by
                the total number of speeches per party. <br />
              </p>
            }
            placement="left"
          >
            <InfoOutlined />
          </Tooltip>
        </div>
      </Grid2>
      <Grid2 ref={ref}>
        <Chart
          type="bar"
          height={
            300 +
            (ref.current
              ?.querySelector(".apexcharts-xaxis")
              ?.getClientRects()[0].height || 0)
          }
          width={430}
          options={options}
          series={[{ name: "Number of speeches", data: values }]}
        />
      </Grid2>
    </Grid2>
  );
}
