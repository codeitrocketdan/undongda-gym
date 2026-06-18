import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";
import { Dagym } from "../model/types";

export const useDagymDetailQuery = (meetingId: string) => {
  return useQuery({
    queryKey: ["dagym", "detail", meetingId],
    queryFn: () => clientFetcher.get<Dagym>(`/api/meetings/${meetingId}`),
  });
};
