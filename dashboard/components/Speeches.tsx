"use client";
import { KeyboardDoubleArrowDown } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useRef, useState } from "react";
import useUser from "../../hooks/useUser";
import { useFrequencySearch } from "../api/useFrequencySearch";
import { useTFIDFSearch } from "../api/useTFIDFSearch";
import { BLUE } from "../modules/constants";
import { DateFilterType } from "../modules/types";
import DetailedSpeeches from "./DetailedSpeeches";
import Search from "./Search";
import SpeechChart from "./SpeechChart";
import TopKWordsChart from "./TopKWordsChart";

const Speeches = () => {
  const user = useUser();
  const [keywordInput, setKeywordInput] = useState(["Russland"]);
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    fromDate: new Date(2010, 0, 1),
    toDate: new Date(2013, 0, 1),
  });
  const [detailOpen, setDetailOpen] = useState<"AUT" | "GER" | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const { data: frequencyResponseAut, mutate: handleFrequencySearchAut } =
    useFrequencySearch({ user, index: "speeches_aut" });
  const { data: frequencyResponseGer, mutate: handleFrequencySearchGer } =
    useFrequencySearch({ user, index: "speeches_ger" });

  const { mutate: searchTopKAut, data: topKResponseAut } =
    useTFIDFSearch("speeches_aut");
  const { mutate: searchTopKGer, data: topKResponseGer } =
    useTFIDFSearch("speeches_ger");

  function handleFrequencySearch() {
    handleFrequencySearchAut({ keywords: keywordInput, isRegex });
    handleFrequencySearchGer({ keywords: keywordInput, isRegex });
  }

  function handleTopKQuery() {
    searchTopKAut({ keywords: keywordInput, dateFilter });
    searchTopKGer({ keywords: keywordInput, dateFilter });
  }

  function handleSearch() {
    if (!keywordInput) return;
    handleFrequencySearch();
    handleTopKQuery();
    setDetailOpen(null);
  }
  function handleDetailOpen(country: "AUT" | "GER") {
    setDetailOpen(country);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }

  useEffect(() => {
    handleTopKQuery();
    console.log([
      dateFilter.fromDate.getFullYear(),
      dateFilter.toDate.getFullYear(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter.fromDate.getFullYear(), dateFilter.toDate.getFullYear()]);

  useEffect(() => {
    console.log("keywordInput", keywordInput);
    handleFrequencySearch();
  }, [user]);

  return (
    <div style={{ minWidth: "0" }}>
      <Search
        values={keywordInput}
        isRegex={isRegex}
        setValue={setKeywordInput}
        setIsRegex={setIsRegex}
        handleFetch={handleSearch}
      />
      <Grid2 container width="100%" marginTop={"10px"} spacing={2}>
        {/* KEYWORD PLOT */}
        <Grid2 xs={6}>
          <Typography variant="h5" color="common.white">
            Austria
          </Typography>
          {frequencyResponseAut && (
            <SpeechChart
              country="AUT"
              keywordResponse={frequencyResponseAut}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}
        </Grid2>
        <Grid2 xs={6} style={{ height: 300 }}>
          <Typography variant="h5" color="common.white">
            Germany
          </Typography>
          {frequencyResponseGer && (
            <SpeechChart
              country="GER"
              keywordResponse={frequencyResponseGer}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}
        </Grid2>
        <Grid2 xs={6} minHeight={320}>
          {topKResponseAut && <TopKWordsChart topKResponse={topKResponseAut} />}
        </Grid2>
        <Grid2 xs={6}>
          {topKResponseGer && <TopKWordsChart topKResponse={topKResponseGer} />}
        </Grid2>

        <Grid2 xs={6}>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <IconButton
              onClick={() => handleDetailOpen("AUT")}
              style={{
                backgroundColor: detailOpen === "AUT" ? BLUE : undefined,
              }}
            >
              <KeyboardDoubleArrowDown fontSize="large" />
            </IconButton>
          </div>
        </Grid2>
        <Grid2 xs={6}>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <IconButton
              onClick={() => handleDetailOpen("GER")}
              style={{
                backgroundColor: detailOpen === "GER" ? BLUE : undefined,
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
            country={detailOpen}
            isRegex={isRegex}
            keywordInput={keywordInput}
            setDateFilter={setDateFilter}
          />
        )}
      </div>
    </div>
  );
};

export default Speeches;
