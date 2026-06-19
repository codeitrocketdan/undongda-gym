export const dagymQueries = {
  all: ["dagym"] as const,

  details: () => [...dagymQueries.all, "detail"] as const,

  detail: (meetingId: string | number) =>
    [...dagymQueries.details(), meetingId] as const,

  participants: (meetingId: string | number) =>
    [...dagymQueries.detail(meetingId), "participants"] as const,

  suggests: () => [...dagymQueries.all, "suggest"] as const,

  suggest: (region: string) => [...dagymQueries.suggests(), region] as const,

  reviews: (meetingId: string | number) =>
    [...dagymQueries.detail(meetingId), "reviews"] as const,

  reviewPage: (meetingId: string | number, page: number) =>
    [...dagymQueries.reviews(meetingId), page] as const,
};
