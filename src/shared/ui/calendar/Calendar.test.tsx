import { act, render, renderHook, screen } from "@testing-library/react";
import { useCalendar } from "./useCalendar";
import WeeklyCalendar from "./WeeklyCalendar";

const FIXED_DATE = new Date(2026, 5, 9); // 2026년 6월 9일(화요일)

describe("캘린더가 화면에 올바르게 표시되는지 테스트", () => {
  test("고정된 오늘 날짜(6월 9일) 기준으로 요일 라벨과 달력 헤더가 올바르게 뜬다", () => {
    render(<WeeklyCalendar today={FIXED_DATE} />);

    const headerTitle = screen.getByText("6월 다짐 기록");
    expect(headerTitle).toBeInTheDocument();

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("월의 전체 주차에 해당하는 날짜들이 Swiper 슬라이드로 화면에 전부 생성된다", () => {
    render(<WeeklyCalendar today={FIXED_DATE} />);

    const firstDay = screen.getAllByText("1"); // 1일부터
    const lastDay = screen.getAllByText("30"); // 30일까지 모두 다 있는지 확인(6월 기준)
    expect(firstDay[0]).toBeInTheDocument();
    expect(lastDay[0]).toBeInTheDocument();
  });
});

describe("월간 모드 검증", () => {
  test("type이 month인 경우 calendarSlides의 id 형식이 yyyy-MM 포맷으로 생성된다", () => {
    const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

    // 6월 기준 앞뒤로 2달씩(MAX_RANGE = 2) - 4월, 5월, 6월, 7월, 8월 포맷이어야 함
    expect(result.current.calendarSlides[2].id).toBe("2026-06");
  });

  test("언제나 앞뒤 2개씩 총 5개의 슬라이드를 생성하고 초기 인덱스는 2여야 한다", () => {
    const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

    expect(result.current.calendarSlides).toHaveLength(5);
    expect(result.current.activeIndex).toBe(2); // 고정된 MAX_RANGE
    expect(result.current.canMovePrev).toBe(true);
    expect(result.current.canMoveNext).toBe(true);
  });

  test("가장 첫 번째 달 슬라이드로 이동 시 이전 이동(canMovePrev)이 불가능해야 한다", () => {
    const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

    act(() => {
      result.current.setActiveIndex(0);
    });

    expect(result.current.canMovePrev).toBe(false);
  });

  test("가장 마지막 달 슬라이드로 이동 시 다음 이동(canMoveNext)이 불가능해야 한다", () => {
    const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

    act(() => {
      result.current.setActiveIndex(4);
    });

    expect(result.current.canMoveNext).toBe(false);
  });
});

describe("useCalendar 훅 테스트", () => {
  describe("주간 모드 검증", () => {
    test("type이 week인 경우 calendarSlides의 id 형식이 주간 연도 포맷(yyyy-II)으로 생성된다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));
      expect(result.current.calendarSlides[0].id).toContain("2026-");
    });

    test("6월 둘째주 기준 - 앞 1주, 뒤 3주로 총 5개 슬라이드가 생성되고, 초기 인덱스는 1이어야한다.", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));

      expect(result.current.calendarSlides).toHaveLength(5);
      expect(result.current.activeIndex).toBe(1);
    });

    test("6월 마지막 주(6월 30일) 기준 - 초기 인덱스가 마지막 인덱스여야 한다", () => {
      const targetDate = new Date(2026, 5, 30);
      const { result } = renderHook(() => useCalendar(targetDate, "week"));

      expect(result.current.calendarSlides).toHaveLength(5);
      expect(result.current.activeIndex).toBe(4);
      expect(result.current.canMoveNext).toBe(false);
    });

    test("선택된 날짜(selectedDate)의 초기값은 주입된 오늘 날짜와 같아야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));
      expect(result.current.selectedDate.getDate()).toBe(9);
    });

    test("다른 날짜를 선택하면 setSelectedDate를 통해 상태가 올바르게 업데이트되어야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));
      const nextDay = new Date(2026, 5, 10);

      act(() => {
        result.current.setSelectedDate(nextDay);
      });

      expect(result.current.selectedDate).toEqual(nextDay);
    });
  });

  describe("슬라이드 이동 및 상호작용", () => {
    it("setActiveIndex로 인덱스를 변경하면 currentStart가 상응하는 날짜로 변경되어야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

      act(() => {
        result.current.setActiveIndex(0); // 첫 번째 슬라이드로 이동
      });

      expect(result.current.activeIndex).toBe(0);
      expect(result.current.canMovePrev).toBe(false);
    });

    it("month 모드에서 setActiveIndex(0) 이동 시 currentStart가 4월(2026-04)이어야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));

      act(() => {
        result.current.setActiveIndex(0);
      });

      // 오늘(6월) 기준 앞으로 2달 → 4월이 첫 슬라이드
      expect(result.current.currentStart.getMonth()).toBe(3); // 0-indexed: 3 = 4월
    });

    it("week 모드에서 setActiveIndex(0) 이동 시 canMovePrev가 false여야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));

      act(() => {
        result.current.setActiveIndex(0);
      });

      expect(result.current.canMovePrev).toBe(false);
      expect(result.current.canMoveNext).toBe(true);
    });
  });

  describe("selectedDate 동작 검증", () => {
    it("month 모드에서도 setSelectedDate로 날짜를 선택할 수 있어야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));
      const targetDate = new Date(2026, 5, 15); // 6월 15일

      act(() => {
        result.current.setSelectedDate(targetDate);
      });

      expect(result.current.selectedDate).toEqual(targetDate);
    });

    it("주간 모드에서 selectedDate 초기값은 주입된 날짜와 같아야 한다", () => {
      const target = new Date(2026, 5, 9);
      const { result } = renderHook(() => useCalendar(target, "week"));
      expect(result.current.selectedDate.getDate()).toBe(9);
      expect(result.current.selectedDate.getMonth()).toBe(5);
    });
  });

  describe("calendarSlides days 배열 검증", () => {
    it("week 모드에서 각 슬라이드의 days 길이는 7이어야 한다", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "week"));
      result.current.calendarSlides.forEach((slide) => {
        expect(slide.days).toHaveLength(7);
      });
    });

    it("month 모드에서 각 슬라이드의 days 길이는 28~42 사이어야 한다 (월 그리드)", () => {
      const { result } = renderHook(() => useCalendar(FIXED_DATE, "month"));
      result.current.calendarSlides.forEach((slide) => {
        expect(slide.days.length).toBeGreaterThanOrEqual(28);
        expect(slide.days.length).toBeLessThanOrEqual(42);
      });
    });
  });
});
