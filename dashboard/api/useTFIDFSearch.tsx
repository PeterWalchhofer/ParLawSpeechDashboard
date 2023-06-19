import { useQuery } from "react-query";
import { DateFilterType, Index, TFIDFResponse } from "../modules/types";

export function useTFIDFSearch({
  index,
  dateFilter: { fromDate, toDate },
  dateFilter,
  keywords,
}: {
  dateFilter: DateFilterType;
  keywords: string[];
  index: Index;
}) {
  return useQuery([index, dateFilter, keywords], (): Promise<TFIDFResponse> => {
    return fetch(`${process.env.NEXT_PUBLIC_FLASK_HOST}/significant_word/${index}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        keywords,
      }),
    }).then((res) => res.json());
  });
}
