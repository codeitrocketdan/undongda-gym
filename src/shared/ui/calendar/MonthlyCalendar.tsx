"use client";

import { format, isSameMonth } from "@/shared/lib/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import DayItem from "./DayItem";
import { useCalendar } from "./useCalendar";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DetailRenderProps {
  selectedDateKey: string | null;
  isActive: boolean;
  onBack: () => void;
}

interface MonthlyCalendarProps {
  completedDays?: Set<string>;
  reservedDays?: Set<string>;
  /*
  - renderDetail(Panel)       : 슬라이드 상세 패널 (모달 등 슬라이드 전환이 필요한 경우)
  - onDateClick(bottom sheet) : 슬라이드 없이 날짜 클릭만 알릴 때 (바텀시트 등 외부에서 처리)
  둘 중 하나만 넘기면 되고, renderDetail이 있으면 onDateClick은 무시됩니다.
  */
  renderDetail?: (props: DetailRenderProps) => ReactNode;
  onDateClick?: (dateKey: string) => void;
}

export default function MonthlyCalendar({
  completedDays = new Set(),
  reservedDays = new Set(),
  renderDetail,
  onDateClick,
}: MonthlyCalendarProps) {
  const pickerType = "month";
  const swiperRef = useRef<SwiperType | null>(null);
  const [today] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const {
    calendarSlides,
    currentStart: currentMonthStart,
    activeIndex,
    setActiveIndex,
    canMovePrev,
    canMoveNext,
  } = useCalendar(today, pickerType);

  const handleDaySelect = (date: Date) => {
    const key = format(date);
    if (completedDays.has(key) || reservedDays.has(key)) {
      if (renderDetail) {
        setSelectedDateKey(key);
      } else {
        onDateClick?.(key);
      }
    }
  };

  const calendarPanel = (
    <div
      className={renderDetail && selectedDateKey ? "pointer-events-none" : ""}
    >
      <div className="mb-6 flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonthStart, "yyyy년 M월")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="이전 달로 이동"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={!canMovePrev}
            className={`cursor-pointer rounded-full p-2 transition-colors ${
              canMovePrev
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-200 opacity-30"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="다음 달로 이동"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={!canMoveNext}
            className={`cursor-pointer rounded-full p-2 transition-colors ${
              canMoveNext
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-not-allowed text-gray-200 opacity-30"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-7 border-b border-gray-50 pb-2 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[12px] font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      <div className="relative w-full">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          initialSlide={activeIndex}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={12}
          speed={400}
          onSlideChangeTransitionEnd={(s) => setActiveIndex(s.activeIndex)}
        >
          {calendarSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid grid-cols-7 justify-items-center gap-y-3">
                {slide.days.map((date) => {
                  const dateKey = format(date, "yyyy-MM-dd");
                  const isCurrentMonth = isSameMonth(date, slide.baseDate);
                  const isDone = completedDays.has(dateKey);
                  const isReserved = reservedDays.has(dateKey);

                  return (
                    <div
                      key={dateKey}
                      className={`w-full ${isCurrentMonth ? "opacity-100" : "opacity-25"}`}
                    >
                      <DayItem
                        day={{ date, dateKey, dayNumber: format(date, "d") }}
                        isSelected={selectedDateKey === dateKey}
                        isDone={isDone}
                        isReserved={isReserved}
                        onSelect={handleDaySelect}
                        pickerType={pickerType}
                      />
                    </div>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );

  // renderDetail이 없으면 캘린더만 렌더링
  if (!renderDetail) {
    return (
      <div className="relative mx-auto w-full rounded-2xl bg-white">
        {calendarPanel}
      </div>
    );
  }

  // renderDetail이 있으면 슬라이드 전환 레이아웃
  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          width: "200%",
          transform: selectedDateKey ? "translateX(-50%)" : "translateX(0)",
        }}
      >
        <div className="w-1/2">{calendarPanel}</div>
        {renderDetail({
          selectedDateKey,
          isActive: !!selectedDateKey,
          onBack: () => setSelectedDateKey(null),
        })}
      </div>
    </div>
  );
}
