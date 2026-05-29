export type MeetingStatus = "upcoming" | "completed";

interface Meeting {
  canceledAt: string | null;
  isCompleted: boolean;
}

// 이용 예정/이용 완료
export function getMeetingStatus(meeting: Meeting): MeetingStatus {
  if (meeting.canceledAt || meeting.isCompleted) return "completed";
  return "upcoming";
}
