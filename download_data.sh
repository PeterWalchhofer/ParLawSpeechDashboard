#!/bin/bash

# Read the data urls from a plain text file
# text file format:
# country=url_to_file

filename="data.txt"

echo >> $filename


if [ ! -f "$filename" ]; then
  echo "File $filename does not exist."
  exit 1
fi

declare -A country_data_urls

while IFS='=' read -r key value; do
  country_data_urls["$key"]="$value"
done < data.txt

# Iterate through the array
for country in "${!country_data_urls[@]}"; do
  data_url=${country_data_urls[$country]}
  
  # Create directory for data
  mkdir -p "data/${country}"
  
  # Download data from URL and save as zip file
  wget -O "data/${country}/${country}.zip" "${data_url}"
  
  # Unzip data to new directory with the same name as the country
  unzip "data/${country}/${country}.zip" -d "data/${country}"

  # Fix encoding of the corpus
  Rscript fixEncoding.R "data/${country}/Corpus_speeches_${country}.RDS"
  
  # Remove the zip file
  rm "data/${country}/${country}.zip"
done
