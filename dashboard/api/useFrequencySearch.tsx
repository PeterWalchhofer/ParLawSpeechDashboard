import { useMutation } from "react-query";
import { AggregationInterval, Amcat, AmcatUser } from "../../amcat4react";
import { FrequencyData } from "../modules/types";

export function useFrequencySearch({
  index,
  user,
}: {
  index: string;
  user: AmcatUser | undefined;
}) {
  return useMutation(
    [index, user],
    ({
      keyword,
      isRegex,
    }: {
      keyword: string;
      isRegex: boolean;
    }): Promise<FrequencyData[]> => {
      const query = { queries: { q0: keyword } };
      const axes = [
        {
          name: "date",
          field: "date",
          interval: "year" as AggregationInterval,
        },
      ];
      if (!user) return Promise.resolve([]);
      return Amcat.postAggregate(user, index, query, {
        axes,
        display: "linechart",
      })
        .then((res) => res.data)
        .then((data) =>
          data.data.map((d: { date_year: string; n: number }) => ({
            ...d,
            date_year: new Date(d.date_year),
          }))
        );
    }
  );
}
