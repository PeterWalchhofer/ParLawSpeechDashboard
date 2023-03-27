import { parse } from "path";
import { useMutation } from "react-query";
import { Amcat, AmcatQuery } from "../../amcat4react";
import useUser from "../../hooks/useUser";
import { parseKeywords } from "../modules/constants";
import { DateFilterType, SpeechesResponse } from "../modules/types";

export function useQuerySpeech(index: string) {
  const user = useUser();
  return useMutation(
    [index],
    ({
      keywords,
      isRegex,
      page,
      dateFilter,
    }: {
      keywords: string[];
      isRegex: boolean;
      page: number;
      dateFilter: DateFilterType;
    }): Promise<SpeechesResponse> => {
      const query: AmcatQuery = {
        queries: parseKeywords(keywords),
        filters: {
          date: {
            gt: dateFilter.fromDate.toISOString(),
            lt: dateFilter.toDate.toISOString(),
          },
        },
      };

      return Amcat.postQuery(user!, index, query, { page })
        .then((res) => res.data)
        .then((data) => ({
          speeches: data.results.map((speech: any) => ({...speech, term_tfidf: JSON.parse(speech.term_tfidf)})),
          total: data.meta.total_count,
        }));
    }
  );
}
