import { useMutation } from "react-query";
import { Amcat, AmcatUser } from "../../amcat4react";
import { parseKeywords, PartyItem } from "../modules/constants";
import { DateFilterType } from "../modules/types";

export function usePartyAggregation({
  index,
  user,
}: {
  index: string;
  user: AmcatUser | undefined;
}) {
  return useMutation(
    [index, user],
    ({
      keywords,
      dateFilter,
    }: {
      keywords?: string[];
      dateFilter: DateFilterType;
    }): Promise<PartyItem[]> => {
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
    }
  );
}
