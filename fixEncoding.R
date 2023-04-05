if (!"tidyverse" %in% rownames(installed.packages()))
  install.packages("tidyverse")
library("tidyverse")
# Retrieve the filename from the command line argument
args <- commandArgs(trailingOnly = TRUE)
filename <- args[1]

# Read the data from the file
speeches <- readRDS(filename)
speeches_fixed <- data.frame(speeches)

for (col in colnames(speeches_fixed)) {
  if (typeof(speeches_fixed[[col]]) != "character") {next}
    vec_encoding <- Encoding(speeches_fixed[[col]]) %>% unique() %>% str_subset("unknown", negate=TRUE)
    if (length(vec_encoding) == 0 || (length(vec_encoding) == 1 && vec_encoding[1] == "UTF-8")) {
      # Skip if all unknown or UTF-8
      next
    }
    # mixed encoding
    print(paste0("Mixed encoding in column ", col))
    encodings <- Encoding(speeches_fixed[[col]])
    speeches_fixed[[col]] <- mapply(function(x, y) {
      if (y != "UTF-8" && y != "unknown") {
        x <- iconv(x, y, "UTF-8")
      }
      return(x)
    }, speeches_fixed[[col]], encodings)
}

# Encoding(speeches_fixed$speaker[200200])

library(readr)
# Write the data to a new file
write_csv(speeches_fixed, paste0(filename, ".csv"))
