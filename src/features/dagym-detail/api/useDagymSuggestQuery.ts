"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";
import { MeetingListResponse } from "../model/types";
import { dagymQueries } from "./queries";

export const useDagymSuggestQuery = () => {
  return useQuery({
    queryKey: dagymQueries.suggests(),

    queryFn: async () => {
      return clientFetcher.get<MeetingListResponse>(`/api/meetings?size=100`);
    },
  });
};
