"use client";
import { MenuItem, Select } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useMiddlecatContext } from "../../amcat4react";
import { useFrequencySearch } from "../api/useFrequencySearch";
import { usePartyAggregation } from "../api/usePartyAggregation";
import { useTFIDFSearch } from "../api/useTFIDFSearch";
import { INDEX_LABELS } from "../modules/constants";
import { DateFilterType, Index } from "../modules/types";
import FrequencyChart from "./FrequencyChart";
import { PartyStatistics } from "./PartyStatistics";
import TopKWordsChart from "./TopKWordsChart";

type ColumnProps = {
  index: Index;
  setChangeIndex: (index: Index) => void;
  keywordInput: string[];
  dateFilter: DateFilterType;
  setDateFilter: (dateFilter: DateFilterType) => void;
  selectedParty?: string;
  setSelectedParty: (party?: string) => void;
};

export default function ChartColumn({
  index,
  setChangeIndex,
  keywordInput,
  dateFilter,
  setDateFilter,
  selectedParty,
  setSelectedParty,
}: ColumnProps) {
  const { user } = useMiddlecatContext();

  const { data: keywordResponse = [] } = useFrequencySearch({
    user,
    index,
    keywords: keywordInput,
  });
  const { data: topKResponse = [] } = useTFIDFSearch({
    index,
    dateFilter,
    keywords: keywordInput,
  });
  const { data: partyData = [] } = usePartyAggregation({
    user,
    index,
    dateFilter,
  });

  return (
    <Grid2 xs={6} minHeight={selectedParty ? 380 : 431} paddingBottom={0}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Select
          value={index}
          onChange={(e) => setChangeIndex(e.target.value as Index)}
          style={{
            color: "white",
            marginLeft: 10,
            fontSize: "1.1rem",
          }}
        >
          {Object.keys(INDEX_LABELS).map((index) => (
            <MenuItem value={index} key={index}>
              {INDEX_LABELS[index as Index].country}
            </MenuItem>
          ))}
        </Select>
      </div>

      <FrequencyChart
        country={index}
        keywordResponse={keywordResponse}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <TopKWordsChart
        topKResponse={topKResponse}
        yAxisRight={!!selectedParty}
      />

      <PartyStatistics
        index={index}
        partyData={partyData}
        dateFilter={dateFilter}
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
      />
    </Grid2>
  );
}
