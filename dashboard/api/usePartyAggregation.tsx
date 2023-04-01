import { useQuery } from "react-query";
import { Amcat, AmcatUser } from "../../amcat4react";
import { parseKeywords, PartyItem } from "../modules/constants";
import { DateFilterType } from "../modules/types";

export function usePartyAggregation({
  index,
  user,
  keywords,
  dateFilter,
}: {
  index: string;
  user: AmcatUser | undefined;
  keywords?: string[];
  dateFilter: DateFilterType;
}) {
  return useQuery(
    [index, user, keywords, dateFilter],
    (): Promise<PartyItem[]> => {
      const queries = {
        queries: keywords ? parseKeywords(keywords) : undefined,
        filters: {
          date: {
            gt: dateFilter.fromDate.toISOString(),
            lt: dateFilter.toDate.toISOString(),
          },
        },
      };
      const axes = [
        {
          name: "party",
          field: "party",
        },
      ];
      if (!user) return Promise.resolve([]);
      return Amcat.postAggregate(user, index, queries, {
        axes,
      }).then((res) => res.data.data);
    },
    { staleTime: Infinity }
  );
}
