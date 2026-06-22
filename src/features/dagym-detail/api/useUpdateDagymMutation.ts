import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DagymUpdateForm } from "../model/types";
import { dagymQueries } from "./queries";

export function useUpdateDagymMutation(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Omit<DagymUpdateForm, "addressDetail">) => {
      return clientFetcher.patch(`/api/meetings/${meetingId}`, body);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dagymQueries.detail(meetingId),
      });
    },
  });
}
