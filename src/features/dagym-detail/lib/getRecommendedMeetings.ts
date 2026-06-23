import { Dagym, Meeting } from "../model/types";

const shuffle = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const isClosed = (meeting: Meeting) => {
  return (
    meeting.registrationEnd && new Date(meeting.registrationEnd) < new Date()
  );
};
export const getRecommendedMeetings = (
  meetings: Meeting[],
  currentMeetingId: string,
  currentType: Dagym["type"],
  limit = 6
) => {
  const filtered = meetings.filter(
    (meeting) =>
      meeting.id.toString() !== currentMeetingId && !isClosed(meeting)
  );

  const sameType = shuffle(
    filtered.filter((meeting) => meeting.type === currentType)
  );

  const otherType = shuffle(
    filtered.filter((meeting) => meeting.type !== currentType)
  );

  return [...sameType, ...otherType].slice(0, limit);
};
