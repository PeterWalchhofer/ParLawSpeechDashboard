import { ArrowBack, ArrowForward, Circle } from "@mui/icons-material";
import { Chip, IconButton, TableFooter } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PARTY_COLORS } from "../modules/constants";
import { Index, SpeechesResponse } from "../modules/types";

type SpeechTableProps = {
  speechesResponse: SpeechesResponse;
  page: number;
  chosenSpeech: number;
  handleChangePage: (page: number) => void;
  setChosenSpeech: (speech: number) => void;
  index: Index;
};

export default function SpeechTable({
  speechesResponse,
  handleChangePage,
  page,
  setChosenSpeech,
  chosenSpeech,
  index,
}: SpeechTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Speaker</TableCell>
            <TableCell align="right">Agenda</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ height: "100%" }}>
          {speechesResponse.speeches.map((speech, i) => (
            <TableRow
              onClick={() => setChosenSpeech(i)}
              selected={i === chosenSpeech}
              hover
              key={`${speech.date} ${speech.speaker} ${speech.agenda} ${i}`}
            >
              <TableCell align="right">{speech.date.slice(0, 16)}</TableCell>
              <TableCell align="right">
                {speech.speaker}
                <br />

                <Chip
                  label={speech.party}
                  size="small"
                  icon={
                    <Circle
                      style={{ color: PARTY_COLORS[index][speech.party] }}
                    />
                  }
                />
              </TableCell>
              <TableCell align="right">
                {speech.agenda.slice(0, 50)}...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell align="right">Page {page + 1}</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">
              <IconButton
                aria-label="previous page"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                <ArrowBack />
              </IconButton>
              <IconButton
                aria-label="next page"
                onClick={() => handleChangePage(page + 1)}
                disabled={
                  speechesResponse.total <=
                  speechesResponse.speeches.length * (page + 1)
                }
              >
                <ArrowForward />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
