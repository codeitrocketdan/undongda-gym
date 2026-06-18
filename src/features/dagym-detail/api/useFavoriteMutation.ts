import { clientFetcher } from "@/shared/api/clientFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dagym } from "../model/types";

export function useFavoriteMutation(meetingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorited: boolean) => {
      if (isFavorited) {
        return clientFetcher.delete(`/api/meetings/${meetingId}/favorites`);
      }

      return clientFetcher.post(`/api/meetings/${meetingId}/favorites`);
    },

    onMutate: async (isFavorited) => {
      await queryClient.cancelQueries({
        queryKey: ["dagym", "detail", meetingId],
      });

      const previousDetail = queryClient.getQueryData<Dagym>([
        "dagym",
        "detail",
        meetingId,
      ]);

      queryClient.setQueryData<Dagym>(["dagym", "detail", meetingId], (old) => {
        if (!old) return old;

        return {
          ...old,
          isFavorited: !isFavorited,
        };
      });

      return { previousDetail };
    },

    // rollback
    onError: (_error, _variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["dagym", "detail", meetingId],
          context.previousDetail
        );
      }
    },

    // 🔥 핵심: 2개 query 정확히 invalidate
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["dagym", "detail", meetingId],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dagym", "suggest"],
        }),
      ]);
    },
  });
}
