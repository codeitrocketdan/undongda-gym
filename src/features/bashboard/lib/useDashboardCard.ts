interface Meeting {
  id: number;
  dateTime: string;
}

export function calculateDashboardStats(meetings: Meeting[]) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = 1월, 5 = 6월 ...

  // 이번 달 참여 횟수 구하기
  const thisMonthMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.dateTime);
    return (
      meetingDate.getFullYear() === currentYear &&
      meetingDate.getMonth() === currentMonth
    );
  });
  const thisMonthCount = thisMonthMeetings.length;

  // 다짐 시간 구하기 (대안: 1회당 1시간(60분)으로 가정하고 계산)
  const MEETING_HOURS_PER_SESSION = 1;
  const totalHours = thisMonthCount * MEETING_HOURS_PER_SESSION;

  // 연속 다짐 일수 구하기 (YMD 문자열로 변환하여 하루씩 역산)
  // 모든 모임 날짜를 'YYYY-MM-DD' 형태로 변환 후 중복 제거 및 내림차순 정렬
  const uniqueDates = Array.from(
    new Set(
      meetings.map((m) => new Date(m.dateTime).toISOString().split("T")[0])
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;

  if (uniqueDates.length > 0) {
    const checkDate = new Date(); // 오늘부터 역산 시작

    // 만약 오늘 모임이 없는데 어제 모임은 있다면 어제부터 연속 체크를 시작하기 위한 방어 코드
    const todayStr = checkDate.toISOString().split("T")[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split("T")[0];

    const startDateStr = uniqueDates.includes(todayStr)
      ? todayStr
      : yesterdayStr;
    const currentCheck = new Date(startDateStr);

    while (true) {
      const dateStr = currentCheck.toISOString().split("T")[0];
      if (uniqueDates.includes(dateStr)) {
        streak++;
        currentCheck.setDate(currentCheck.getDate() - 1); // 하루 전으로 이동
      } else {
        break; // 연속이 끊기면 종료
      }
    }
  }

  return {
    streak, // 연속 다짐 (일)
    thisMonthCount, // 이번 달 다짐 횟수 (회)
    totalHours, // 다짐 시간 (시간)
  };
}
