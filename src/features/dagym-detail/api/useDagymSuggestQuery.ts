"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";
import { MeetingListResponse } from "../model/types";
import { dagymQueries } from "./queries";

export const useDagymSuggestQuery = (region: string) => {
  return useQuery({
    queryKey: dagymQueries.suggest(region),

    queryFn: async () => {
      return clientFetcher.get<MeetingListResponse>(
        `/api/meetings?region=${region}&size=6`
      );
    },
  });
};
