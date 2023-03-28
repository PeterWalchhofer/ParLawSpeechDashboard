import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import useUser from "../../hooks/useUser";
import { usePartyAggregation } from "../api/usePartyAggregation";
import { BLACK, hexToHsl, PartyItem } from "../modules/constants";
import { DateFilterType, Index } from "../modules/types";

type PartyStatisticsProps = {
  partyData: PartyItem[];
  keywordInput: string[];
  index: Index;
  dateFilter: DateFilterType;
};
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PARTY_COLORS: Record<Index, Record<string, string>> = {
  speeches_ger: {
    "CDU/CSU": "#000000",
    SPD: "#E4002B",
    FDP: "#FFCE00",
    "BÜNDNIS 90/DIE GRÜNEN": "#008A00",
    "DIE LINKE": "#DC4405",
    AfD: "#00A1DE",
    PIRATEN: "#00A1DE",
  },
  speeches_aut: {
    ÖVP: "#000000",
    SPÖ: "#E4002B",
    FPÖ: "#205CA5",
    Grüne: "#008A00",
    NEOS: "#E84188",
    KPÖ: "#00A1DE",
    PILZ: "#CCCCCC",
    JETZT: "#CCCCCC",
    BZÖ: "#EE7F00",
    LIF: "#FECD00",
  },
};

export function PartyStatistics({
  keywordInput,
  index,
  partyData,
  dateFilter,
}: PartyStatisticsProps) {
  const user = useUser();
  const [normalized, setNormalized] = useState<boolean>(false);
  const { data: totals, mutate: queryTotals } = usePartyAggregation({
    index,
    user,
  });

  const values = useMemo(
    () =>
      partyData
        .map((item) => ({
          x: item.party.split(/(?<=\/)/), // split including / to keep it. Array for line-break
          y: normalized
            ? item.n /
              (totals?.find((party) => party.party === item.party)?.n || 1)
            : item.n,
          fillColor: PARTY_COLORS[index][item.party],
        }))
        .sort((a, b) => {
          const lum_a = hexToHsl(a.fillColor)[2];
          const lum_b = hexToHsl(b.fillColor)[2];
          return lum_a - lum_b;
        }),
    [partyData, normalized]
  );

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

      chart: {
        type: "bar",
        background: BLACK,
        id: "germany",
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          distributed: true,
        },
      },
    }),
    [partyData, normalized]
  );

  useEffect(() => {
    queryTotals({ dateFilter });
  }, [index]);

  console.log(totals);
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
          }}
        >
          <ToggleButtonGroup
            value={normalized}
            exclusive
            aria-label="outlined button group"
            onChange={() => setNormalized((prev) => !prev)}
            size="small"
          >
            <ToggleButton value={true}>Norm</ToggleButton>
            <ToggleButton value={false}>Total</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Grid2>
      <Grid2>
        <Chart
          type="bar"
          height={350}
          width={430}
          options={options}
          series={[{ name: "Number of speeches", data: values }]}
        />
      </Grid2>
    </Grid2>
  );
}
