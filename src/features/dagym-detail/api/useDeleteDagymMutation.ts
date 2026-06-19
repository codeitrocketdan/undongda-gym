import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { dagymQueries } from "./queries";

export const useDeleteDagymMutation = (meetingId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clientFetcher.delete(`/api/meetings/${meetingId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: dagymQueries.all,
      });

      router.push("/");
    },
  });
};
