import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  TextField,
  TextFieldProps,
  Tooltip
} from "@mui/material";

type SearchType = {
  values: string[];
  setValue: (value: string[]) => void;
} & TextFieldProps;

const Search = ({ values, setValue }: SearchType) => {
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
          value={values}
          onChange={(_, value) => setValue(value || [])}
          options={[]}
          disableClearable={false}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size="small"
              style={{ paddingRight: 0 }}
              placeholder="Search for keywords"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    <Tooltip
                      title={
                        <p>
                          Filter speeches by keywords. You can use multiple
                          Keywords, such as 'Edward Snowden' and 'Bradley
                          Manning', or use multiple keywords like 'Russland' and
                          'Russia' to cope for different languages
                          <br />
                          <br />
                          Also{" "}
                          <a
                            href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html"
                            target="_blank"
                          >
                            Lucene Query Syntax
                          </a>{" "}
                          is supported. This allows you to use boolean
                          operators, proximity searches, wildcards, and more.
                        </p>
                      }
                    >
                      <InfoOutlined />
                    </Tooltip>
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default Search;
