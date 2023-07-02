"use client";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useRef, useState } from "react";
import { DateFilterType, Index } from "../modules/types";
import DetailedSpeeches from "./DetailedSpeeches";
import DownArrow from "./DownArrow";
import Search from "./Search";
import ChartColumn from "./ChartColumn";
import { useMiddlecatContext } from "../../amcat4react";
import { LoadingIndicator } from "./LoadingIndicator";

const Speeches = () => {
  const [keywordInput, setKeywordInput] = useState(["Russland"]);
  const [indexLeft, setIndexLeft] = useState<Index>("speeches_austria");
  const [indexRight, setIndexRight] = useState<Index>("speeches_germany");
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    fromDate: new Date(2013, 0, 1),
    toDate: new Date(2016, 0, 1),
  });
  const [detailOpen, setDetailOpen] = useState<Index | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [selectedParty, setSelectedParty] = useState<
    Record<string, string> | undefined
  >();
  const { user, signInGuest } = useMiddlecatContext();

  
  function handleDetailOpen(country: Index) {
    setDetailOpen(country);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  }

  function handleSetSelectedParty(index: string) {
    return (party?: string) => {
      if (!party) {
        setSelectedParty(undefined);
        return;
      }
      setSelectedParty({ [index]: party });
      handleDetailOpen(index as Index);
    };
  }

  useEffect(() => {
    document.title = "ParlSpeechTracker";
  }, []);


  useEffect(() => {
    if (user) return;
    const hostEnv = process.env.NEXT_PUBLIC_AMCAT_HOST;
    signInGuest?.(hostEnv || "http://localhost/amcat", "", false);
  }, [user]);

  return (
    <div style={{ minWidth: "0" }}>
      <LoadingIndicator />
      <Search values={keywordInput} setValue={setKeywordInput} />

      <Grid2 container width="100%" marginTop={"10px"} spacing={2}>
        {/* Left Column */}
        <ChartColumn
          index={indexLeft}
          setChangeIndex={setIndexLeft}
          keywordInput={keywordInput}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedParty={selectedParty?.[indexLeft]}
          setSelectedParty={handleSetSelectedParty(indexLeft)}
        />

        {/* Right Column */}
        <ChartColumn
          index={indexRight}
          setChangeIndex={setIndexRight}
          keywordInput={keywordInput}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          selectedParty={selectedParty?.[indexRight]}
          setSelectedParty={handleSetSelectedParty(indexRight)}
        />

        <Grid2 xs={6}>
          <DownArrow
            detailOpen={detailOpen === indexLeft}
            onClick={() => {
              setSelectedParty(undefined);
              handleDetailOpen(indexLeft);
            }}
          />
        </Grid2>
        <Grid2 xs={6}>
          <DownArrow
            detailOpen={detailOpen === indexRight}
            onClick={() => {
              setSelectedParty(undefined);
              handleDetailOpen(indexRight);
            }}
          />
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
