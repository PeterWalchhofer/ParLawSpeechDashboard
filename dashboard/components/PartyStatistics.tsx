import dynamic from "next/dynamic";
import { useMemo } from "react";
import useUser from "../../hooks/useUser";
import { BLACK, hexToHsl, PartyItem } from "../modules/constants";
import { Index } from "../modules/types";

type PartyStatisticsProps = {
  partyData: PartyItem[];
  keywordInput: string[];
  index: Index;
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
    FPÖ: "#FFCE00",
    GRÜNE: "#008A00",
    NEOS: "#DC4405",
    KPÖ: "#00A1DE",
    PILZ: "#00A1DE",
    BZÖ: "#00A1DE",
  },
};

export function PartyStatistics({
  keywordInput,
  index,
  partyData,
}: PartyStatisticsProps) {
  const user = useUser();

  const values = useMemo(
    () =>
      partyData
        .map((item) => ({
          x: item.party.split(/(?<=\/)/), // split including / to keep it. Array for line-break
          y: item.n,
          fillColor: PARTY_COLORS[index][item.party],
        }))
        .sort((a, b) => {
          const lum_a = hexToHsl(a.fillColor)[2];
          const lum_b = hexToHsl(b.fillColor)[2];
          return lum_a - lum_b;
        }),
    [partyData]
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
        // labels: {
        //   formatter: function (val: number) {
        //     return val.toFixed(3);
        //   },
        // },
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
    [partyData]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Chart
        type="bar"
        height={350}
        width={430}
        options={options}
        series={[{ name: "Number of speeches", data: values }]}
      />
    </div>
  );
}
