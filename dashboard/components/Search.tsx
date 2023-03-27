import { Clear, Search as SearchIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  IconButton,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { BLUE, GRAY } from "../modules/constants";

type SearchType = {
  values: string[];
  isRegex: boolean;
  setValue: (value: string[]) => void;
  setIsRegex: (value: boolean) => void;
  handleFetch: () => void;
} & TextFieldProps;

const Search = ({
  values,
  isRegex,
  setValue,
  setIsRegex,
  handleFetch,
}: SearchType) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Autocomplete
        multiple
        freeSolo
        style={{ minWidth: "400px" }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        defaultValue={values}
        onChange={(_, value) => setValue(value)}
        options={[]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            //style={{ height: "2rem" }}
            InputProps={{
              ...params.InputProps,
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
                  {values?.length && (
                    <IconButton onClick={() => setValue([])}>
                      <Clear />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
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
