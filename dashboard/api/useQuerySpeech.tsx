import { useQuery } from "react-query";
import { Amcat, AmcatQuery, useMiddlecatContext } from "../../amcat4react";
import { parseKeywords } from "../modules/constants";
import { DateFilterType, SpeechesResponse } from "../modules/types";

export function useQuerySpeech({
  keywords,
  page,
  dateFilter,
  selectedParty,
  index,
  speakerFilter,
}: {
  index: string;
  keywords: string[];
  page: number;
  dateFilter: DateFilterType;
  selectedParty?: string;
  speakerFilter?: string;
}) {
  const { user } = useMiddlecatContext();
  return useQuery(
    [index, keywords, page, dateFilter, selectedParty, speakerFilter],
    (): Promise<SpeechesResponse> => {
      if (!user) return Promise.resolve({ speeches: [], total: 0 });
      const query: AmcatQuery = {
        queries: parseKeywords(keywords),
        filters: {
          date: {
            gt: dateFilter.fromDate.toISOString(),
            lt: dateFilter.toDate.toISOString(),
          },
          ...(selectedParty && {
            party: {
              values: [selectedParty],
            },
          }),
          ...(speakerFilter && {
            speaker: {
              values: [speakerFilter],
            },
          }),
        },
      };

      return Amcat.postQuery(user, index, query, { page })
        .then((res) => res.data)
        .then((data) => ({
          speeches: data.results.map((speech: any) => ({
            ...speech,
            term_tfidf: JSON.parse(speech.term_tfidf),
          })),
          total: data.meta.total_count,
        }));
    }
  );
}
