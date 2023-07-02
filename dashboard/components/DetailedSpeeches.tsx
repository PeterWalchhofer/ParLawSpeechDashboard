"use client";
import { Search, Square, Clear } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useMiddlecatContext } from "../../amcat4react";
import { usePartyAggregation } from "../api/usePartyAggregation";
import { useQuerySpeech } from "../api/useQuerySpeech";
import { INDEX_LABELS, PARTY_COLORS } from "../modules/constants";
import { DateFilterType, Index } from "../modules/types";
import SpeechTable from "./SpeechTable";
import SpeechWordCloud from "./SpeechWordCloud";

type DetailedSpeechesProps = {
  dateFilter: DateFilterType;
  setDateFilter: (dateFilter: DateFilterType) => void;
  keywordInput: string[];
  index: Index;
  selectedParty?: string;
  setSelectedParty: (party?: string) => void;
};
export default function DetailedSpeeches({
  dateFilter,
  setDateFilter,
  keywordInput,
  index,
  selectedParty,
  setSelectedParty,
}: DetailedSpeechesProps) {
  const [chosenSpeech, setChosenSpeech] = useState<number | undefined>(0);
  const [showWordCloud, setShowWordCloud] = useState<boolean>(false);
  const [speakerInput, setSpeakerInput] = useState<string>("");
  const [speakerFilter, setSpeakerFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [highlightTfIdf, setHighlightTfIdf] = useState<boolean>(false);
  const { data: speeches } = useQuerySpeech({
    dateFilter,
    index,
    selectedParty,
    keywords: keywordInput,
    page,
    speakerFilter,
  });
  const { user } = useMiddlecatContext();

  const { data: totals } = usePartyAggregation({
    index,
    user,
    dateFilter,
  });

  useEffect(() => {
    setPage(0);
  }, [dateFilter, index, selectedParty]);

  useEffect(() => {
    setSpeakerInput(speakerFilter || "");
  }, [speakerFilter]);

  useEffect(() => {
    setSpeakerFilter(undefined);
    setSelectedParty(undefined);
  }, [index, dateFilter]);

  const highlightWords =
    chosenSpeech !== undefined && highlightTfIdf
      ? speeches?.speeches?.[chosenSpeech]?.term_tfidf
          .slice(0, 20)
          .map((word) => word.term)
      : keywordInput;

  return (
    <Grid2 container spacing={2} style={{ minHeight: "500px" }}>
      <Grid2 xs={12} style={{ marginBottom: 25 }}>
        <Typography variant="h4" color="common.white">
          Explore{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "#4691bd",
            }}
          >
            {INDEX_LABELS[index].countryFrom}
          </span>{" "}
          Speeches
        </Typography>
      </Grid2>
      <Grid2 xs={12} container>
        <Grid2>
          <DatePicker
            InputProps={{ style: { width: "160px" } }}
            label="From"
            value={moment(dateFilter.fromDate)}
            onChange={(newValue) => {
              newValue &&
                setDateFilter({ ...dateFilter, fromDate: newValue.toDate() });
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Grid2>
        <Grid2>
          <DatePicker
            InputProps={{ style: { width: "160px" } }}
            label="To"
            value={moment(dateFilter.toDate)}
            onChange={(newValue) =>
              newValue &&
              setDateFilter({ ...dateFilter, toDate: newValue.toDate() })
            }
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </Grid2>
        <Grid2>
          {totals && (
            <FormControl>
              <InputLabel id="test-select-label" shrink={true}>
                Party
              </InputLabel>
              <Select
                value={selectedParty || ""}
                onChange={(e) => setSelectedParty(e.target.value)}
                displayEmpty
                labelId="test-select-label"
                size="small"
                label="Party"
                style={{ height: "37px" }}
                notched={true}
                // style={{ color: "white", marginLeft: 10, fontSize: "1.2rem" }}
              >
                <MenuItem value={""}>
                  All Parties ({_.sum(totals.map((partyCount) => partyCount.n))}
                  )
                </MenuItem>
                {totals
                  .sort((a, b) => b.n - a.n)
                  .map((partyCount) => (
                    <MenuItem value={partyCount.party} key={partyCount.party}>
                      <Square
                        style={{
                          color: PARTY_COLORS[index][partyCount.party],
                          marginRight: 8,
                        }}
                      />
                      {partyCount.party} ({partyCount.n})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Grid2>
        <Grid2>
          <TextField
            label="Speaker"
            size="small"
            value={speakerInput}
            onChange={(e) => setSpeakerInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSpeakerFilter(speakerInput || undefined);
              }
            }}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton
                    onClick={() => {
                      setSpeakerInput("");
                      setSpeakerFilter(undefined);
                    }}
                  >
                    <Clear />
                  </IconButton>
                  <IconButton
                    onClick={() => setSpeakerFilter(speakerInput || undefined)}
                  >
                    <Search />
                  </IconButton>
                </>
              ),
            }}
          />
        </Grid2>
      </Grid2>

      {speeches && (
        <Grid2
          container
          maxHeight={"900px"}
          minHeight={"900px"}
          justifyContent="center"
          width="100%"
        >
          <Grid2 xs={6}>
            <SpeechTable
              speechesResponse={speeches}
              handleChangePage={(page: number) => setPage(page)}
              page={page}
              chosenSpeech={chosenSpeech}
              setChosenSpeech={setChosenSpeech}
              index={index}
              setSpeakerFilter={setSpeakerFilter}
              setPartyFilter={setSelectedParty}
            />
          </Grid2>

          <Grid2 xs={6} style={{ padding: 10 }} height="100%">
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              marginBottom={0.5}
            >
              <ToggleButton
                value="check"
                selected={highlightTfIdf}
                onClick={() => setHighlightTfIdf(!highlightTfIdf)}
                style={{
                  visibility: showWordCloud ? "hidden" : "visible",
                  fontSize: "0.7rem",
                  padding: 8,
                }}
              >
                TF-IDF
              </ToggleButton>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Typography>Text</Typography>
                <Switch
                  checked={showWordCloud}
                  onChange={() => setShowWordCloud(!showWordCloud)}
                />
                <Typography>Word Cloud</Typography>
              </Stack>
            </Stack>

            {showWordCloud && (
              <SpeechWordCloud
                chosenSpeech={
                  chosenSpeech !== undefined && speeches.speeches[chosenSpeech]
                }
              />
            )}
            {!showWordCloud && (
              <Paper
                style={{
                  height: "100%",
                  padding: 10,

                  //marginTop: 0,
                  //paddingTop: 0,
                  overflow: "scroll",
                  overflowX: "hidden",
                }}
              >
                <h4>
                  {chosenSpeech !== undefined
                    ? speeches.speeches[chosenSpeech]?.agenda
                    : null}{" "}
                </h4>
                <p>
                  <b>
                    {chosenSpeech !== undefined
                      ? speeches.speeches[chosenSpeech]?.speaker
                      : null}{" "}
                  </b>{" "}
                  ·{" "}
                  <i>
                    {chosenSpeech !== undefined
                      ? speeches.speeches[chosenSpeech]?.party
                      : null}
                  </i>
                </p>

                <p>
                  <Highlighter
                    textToHighlight={
                      chosenSpeech !== undefined
                        ? speeches.speeches[chosenSpeech]?.text
                        : ""
                    }
                    searchWords={highlightWords || keywordInput}
                    highlightStyle={{
                      backgroundColor: "white",
                      color: "black",
                      paddingLeft: 2,
                      paddingRight: 2,
                    }}
                  />
                </p>
              </Paper>
            )}
          </Grid2>
        </Grid2>
      )}
    </Grid2>
  );
}
