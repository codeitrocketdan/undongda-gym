import { clientFetcher } from "@/shared/api/clientFetcher";
import { useQuery } from "@tanstack/react-query";
import { Dagym } from "../model/types";
import { dagymQueries } from "./queries";

export const useDagymDetailQuery = (meetingId: string) => {
  return useQuery({
    queryKey: dagymQueries.detail(meetingId),
    queryFn: () => clientFetcher.get<Dagym>(`/api/meetings/${meetingId}`),
  });
};
