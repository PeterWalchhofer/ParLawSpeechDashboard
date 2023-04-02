export type FrequencyData = { date_year: Date; n: number }

export type Index = "speeches_austria" | "speeches_germany"
  
export  type SpeechesResponse = {
    total: number;
    speeches: {
      _id: string
      title: string
      date: string
      text: string
      staatsminister: boolean
      speech_ID: string
      agenda: string
      term_tfidf: string
      speaker: string
      speaker_raw: string
      year: number
      speech_procedure_ID: string
      party: string
      chancelor: boolean
      chair: boolean
      raw_text: string
      minister: boolean
    }[];
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