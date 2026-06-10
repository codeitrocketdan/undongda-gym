import { useQuery } from "@tanstack/react-query";
import { MeetingTypeDTO } from "../types";

export function useMeetingTypes() {
  return useQuery<MeetingTypeDTO[]>({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting-types`
      );
      return res.json();
    },
  });
}
