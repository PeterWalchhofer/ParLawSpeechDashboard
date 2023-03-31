"use client";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import { IconButton, MenuItem, Select } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useRef, useState } from "react";
import useUser from "../../hooks/useUser";
import { useFrequencySearch } from "../api/useFrequencySearch";
import { usePartyAggregation } from "../api/usePartyAggregation";
import { useTFIDFSearch } from "../api/useTFIDFSearch";
import { BLUE, INDEX_LABELS } from "../modules/constants";
import { DateFilterType, Index } from "../modules/types";
import DetailedSpeeches from "./DetailedSpeeches";
import { PartyStatistics } from "./PartyStatistics";
import Search from "./Search";
import SpeechChart from "./SpeechChart";
import TopKWordsChart from "./TopKWordsChart";

const Speeches = () => {
  const user = useUser();
  const [keywordInput, setKeywordInput] = useState(["Russland"]);
  const [indexLeft, setIndexLeft] = useState<Index>("speeches_aut");
  const [indexRight, setIndexRight] = useState<Index>("speeches_ger");
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    fromDate: new Date(2013, 0, 1),
    toDate: new Date(2016, 0, 1),
  });
  const [detailOpen, setDetailOpen] = useState<Index | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [selectedParty, setSelectedParty] = useState<Record<
    string,
    string
  > | null>(null);

  // API hooks
  const { data: frequencyResponseAut = [], mutate: handleFrequencySearchAut } =
    useFrequencySearch({ user, index: indexLeft });
  const { data: frequencyResponseGer = [], mutate: handleFrequencySearchGer } =
    useFrequencySearch({ user, index: indexRight });

  const { mutate: searchTopKAut, data: topKResponseAut = [] } =
    useTFIDFSearch(indexLeft);
  const { mutate: searchTopKGer, data: topKResponseGer = [] } =
    useTFIDFSearch(indexRight);

  const { data: partyDataAut = [], mutate: queryPartyStatisticsAut } =
    usePartyAggregation({ index: indexLeft, user });
  const { data: partyDataGer = [], mutate: queryPartyStatisticsGer } =
    usePartyAggregation({ index: indexRight, user });

  // API trigger functions
  function handleFrequencySearch() {
    handleFrequencySearchAut({ keywords: keywordInput });
    handleFrequencySearchGer({ keywords: keywordInput });
  }
  function handleTopKQuery() {
    searchTopKAut({ keywords: keywordInput, dateFilter });
    searchTopKGer({ keywords: keywordInput, dateFilter });
  }
  function handlePartyStatistics() {
    queryPartyStatisticsAut({ keywords: keywordInput, dateFilter });
    queryPartyStatisticsGer({ keywords: keywordInput, dateFilter });
  }

  function handleSearch() {
    if (!keywordInput) return;
    handleFrequencySearch();
    handleTopKQuery();
    handlePartyStatistics();
    setDetailOpen(null);
  }
  function handleDetailOpen(country: Index) {
    setDetailOpen(country);
    setSelectedParty(null);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }

  function handleSetSelectedParty(index: string) {
    return (party: string) => {
      setSelectedParty({ [index]: party });
      handleDetailOpen(index as Index);
    };
  }

  useEffect(() => {
    handleTopKQuery();
    handlePartyStatistics();
    console.log([
      dateFilter.fromDate.getFullYear(),
      dateFilter.toDate.getFullYear(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter.fromDate.getFullYear(), dateFilter.toDate.getFullYear()]);

  useEffect(() => {
    handleSearch();
  }, [user, indexLeft, indexRight]);

  return (
    <div style={{ minWidth: "0" }}>
      <Search
        values={keywordInput}
        setValue={setKeywordInput}
        handleFetch={handleSearch}
      />

      <Grid2 container width="100%" marginTop={"10px"} spacing={2}>
        {/* KEYWORD PLOT */}
        <Grid2 xs={6}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Select
              value={indexLeft}
              onChange={(e) => setIndexLeft(e.target.value as Index)}
              style={{ color: "white", marginLeft: 10, fontSize: "1.2rem" }}
            >
              {Object.keys(INDEX_LABELS).map((index) => (
                <MenuItem value={index} key={index}>
                  {INDEX_LABELS[index as Index].country}
                </MenuItem>
              ))}
            </Select>
          </div>

          <SpeechChart
            country="AUT"
            keywordResponse={frequencyResponseAut}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </Grid2>
        <Grid2 xs={6} style={{ height: 300 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Select
              value={indexRight}
              onChange={(e) => setIndexRight(e.target.value as Index)}
              style={{ color: "white", marginLeft: 10, fontSize: "1.2rem" }}
            >
              {Object.keys(INDEX_LABELS).map((index) => (
                <MenuItem value={index} key={index}>
                  {INDEX_LABELS[index as Index].country}
                </MenuItem>
              ))}
            </Select>
          </div>

          <SpeechChart
            country="GER"
            keywordResponse={frequencyResponseGer}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </Grid2>
        <Grid2 xs={6} minHeight={431}>
          <TopKWordsChart topKResponse={topKResponseAut} yAxisRight />
        </Grid2>
        <Grid2 xs={6}>
          <TopKWordsChart topKResponse={topKResponseGer} />
        </Grid2>

        <Grid2 xs={6} minHeight={380} paddingBottom={0}>
          <PartyStatistics
            index={indexLeft}
            keywordInput={keywordInput}
            partyData={partyDataAut}
            dateFilter={dateFilter}
            selectedParty={selectedParty?.[indexLeft]}
            setSelectedParty={handleSetSelectedParty(indexLeft)}
          />
        </Grid2>
        <Grid2 xs={6} minHeight={373} paddingBottom={0}>
          <PartyStatistics
            index={indexRight}
            keywordInput={keywordInput}
            partyData={partyDataGer}
            dateFilter={dateFilter}
            selectedParty={selectedParty?.[indexRight]}
            setSelectedParty={handleSetSelectedParty(indexRight)}
          />
        </Grid2>

        <Grid2 xs={6}>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <IconButton
              onClick={() => handleDetailOpen(indexLeft)}
              style={{
                backgroundColor: detailOpen === indexLeft ? BLUE : undefined,
              }}
            >
              <KeyboardDoubleArrowDown fontSize="large" />
            </IconButton>
          </div>
        </Grid2>
        <Grid2 xs={6}>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <IconButton
              onClick={() => handleDetailOpen(indexRight)}
              style={{
                backgroundColor: detailOpen === indexRight ? BLUE : undefined,
              }}
            >
              <KeyboardDoubleArrowDown fontSize="large" />
            </IconButton>
          </div>
        </Grid2>
      </Grid2>
      <div ref={detailRef}>
        {detailOpen && (
          <DetailedSpeeches
            dateFilter={dateFilter}
            index={detailOpen}
            keywordInput={keywordInput}
            setDateFilter={setDateFilter}
            selectedParty={selectedParty?.[detailOpen]}
            setSelectedParty={handleSetSelectedParty(detailOpen)}
          />
        )}
      </div>
    </div>
  );
};

export default Speeches;
