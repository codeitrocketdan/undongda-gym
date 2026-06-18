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

// 카드 썸네일 위에 띄울 오버레이 문구 (취소/모집 마감/정원 마감)
export function getOverlayText(
  canceledAt: string | null,
  registrationEnd: string | null,
  participantCount: number,
  capacity: number
): string | null {
  if (canceledAt) return "취소";
  if (registrationEnd && new Date(registrationEnd) < new Date())
    return "모집 마감";
  if (participantCount >= capacity) return "정원 마감";
  return null;
}
