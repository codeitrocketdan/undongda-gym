"use client";

import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";
import { MeetingListResponse } from "../model/types";

export const useDagymSuggestQuery = (region: string) => {
  return useQuery({
    queryKey: ["dagym", "suggest"],

    queryFn: async () => {
      return clientFetcher.get<MeetingListResponse>(
        `/api/meetings?region=${region}&size=6`
      );
    },
  });
};
