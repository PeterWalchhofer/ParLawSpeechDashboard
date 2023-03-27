import { useMutation } from "react-query";
import useUser from "../../hooks/useUser";
import { DateFilterType, TFIDFResponse } from "../modules/types";

export function useTFIDFSearch(index: string) {
  const user = useUser();
  return useMutation(
    [index],
    ({
      dateFilter: { fromDate, toDate },
      keyword,
    }: {
      dateFilter: DateFilterType;
      keyword: string;
    }): Promise<TFIDFResponse> => {
      return fetch(`http://localhost:5000/significant_word/${index}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          keyword,
        }),
      }).then((res) => res.json());
    }
  );
}
