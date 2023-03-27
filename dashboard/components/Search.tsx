import { Clear, Search as SearchIcon } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { BLUE, GRAY } from "../modules/constants";

type SearchType = {
  value: string;
  isRegex: boolean;
  setValue: (value: string) => void;
  setIsRegex: (value: boolean) => void;
  handleFetch: () => void;
} & TextFieldProps;

const Search = ({
  value,
  isRegex,
  setValue,
  setIsRegex,
  handleFetch,
}: SearchType) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <TextField
        variant="outlined"
        size="small"
        style={{ height: "2rem" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <>
              <IconButton onClick={() => setIsRegex(!isRegex)}>
                <span
                  style={{
                    color: GRAY,
                    fontSize: "0.8rem",
                    backgroundColor: isRegex ? BLUE : "transparent",
                    padding: 3,
                    borderRadius: 5,
                  }}
                >
                  .✱
                </span>
              </IconButton>
              {value && (
                <IconButton onClick={() => setValue("")}>
                  <Clear />
                </IconButton>
              )}
            </>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleFetch();
          }
        }}
      />

      <IconButton
        onClick={() => {
          handleFetch();
        }}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default Search;
