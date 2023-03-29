"use client";
import { Square } from "@mui/icons-material";
import {
  FormControl,
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
import _, { debounce } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import useUser from "../../hooks/useUser";
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
  setSelectedParty: (party: string) => void;
};
export default function DetailedSpeeches({
  dateFilter,
  setDateFilter,
  keywordInput,
  index,
  selectedParty,
  setSelectedParty,
}: DetailedSpeechesProps) {
  const [chosenSpeech, setChosenSpeech] = useState<number>(0);
  const [showWordCloud, setShowWordCloud] = useState<boolean>(false);
  const [page, setPage] = useState(0);
  const [highlightTfIdf, setHighlightTfIdf] = useState<boolean>(false);
  const { data: speeches, mutate: getSpeeches } = useQuerySpeech(index);
  const user = useUser();
  const { data: totals, mutate: queryTotals } = usePartyAggregation({
    index,
    user,
  });

  const handleSpeechesSearch = () => {
    getSpeeches({ keywords: keywordInput, page, dateFilter, selectedParty });
  };

  useEffect(() => {
    debounce(handleSpeechesSearch, 200)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, page, index, selectedParty]);

  useEffect(() => {
    setPage(0);
  }, [dateFilter, index]);

  useEffect(() => {
    queryTotals({ dateFilter });
  }, []);

  const highlightWords = highlightTfIdf
    ? speeches?.speeches[chosenSpeech]?.term_tfidf
        .slice(0, 20)
        .map((word: any) => word.term)
    : keywordInput;

  return (
    <Grid2 container spacing={2} style={{ minHeight: "400px" }}>
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
      </Grid2>

      {speeches && (
        <>
          <Grid2 xs={5}>
            <SpeechTable
              speechesResponse={speeches}
              handleChangePage={(page: number) => setPage(page)}
              page={page}
              chosenSpeech={chosenSpeech}
              setChosenSpeech={setChosenSpeech}
            />
          </Grid2>

          <Grid2 xs={6} maxHeight="780px" style={{ margin: 10 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
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
              <SpeechWordCloud chosenSpeech={speeches.speeches[chosenSpeech]} />
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
                <h4>{speeches.speeches[chosenSpeech].agenda} </h4>
                <p>
                  <b>{speeches.speeches[chosenSpeech].speaker} </b> ·{" "}
                  <i>{speeches.speeches[chosenSpeech].party}</i>
                </p>

                <p>
                  <Highlighter
                    textToHighlight={speeches.speeches[chosenSpeech].text}
                    searchWords={highlightWords}
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
        </>
      )}
    </Grid2>
  );
}
