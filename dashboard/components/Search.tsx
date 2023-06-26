import { Clear, Search as SearchIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  IconButton,
  TextField,
  TextFieldProps,
} from "@mui/material";

type SearchType = {
  values: string[];
  setValue: (value: string[]) => void;
  handleFetch: () => void;
} & TextFieldProps;

const Search = ({ values, setValue, handleFetch }: SearchType) => {
  return (
    <div>
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
    </div>
  );
};

export default Search;
