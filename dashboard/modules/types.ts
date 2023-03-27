export type FrequencyData = { date_year: Date; n: number }
  
export  type SpeechesResponse = {
    total: number;
    speeches: any[];
  }

export type DateFilterType={
  fromDate: Date,
  toDate: Date,
}

// type SignificantWordBucket = {
//   bg_count: number;
//   doc_count: 30;
//   key: string;
//   score: number
// };

// export type TFIDFResponse = {
//   aggregations: {
//     top_terms: {
//       bg_count: number;
//       buckets: SignificantWordBucket[];
//       doc_count: number;
//     };
//   };
// };
  
export type TFIDFResponse = [string, number][]