"use client";
import { MonthlyCalendar, WeeklyCalendar } from "@/shared/ui/calendar";
import { Modal, useModal } from "@/shared/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { Bell, CalendarCheck } from "lucide-react";
import type { Meeting } from "./DashboardCardSection";

async function fetchJoinedMeetings(): Promise<{ data: Meeting[] }> {
  const response = await fetch("/api/users/me/meetings");
  if (!response.ok) throw new Error(`서버 에러 상태코드: ${response.status}`);
  return response.json();
}

export default function MainContent() {
  const modal = useModal();

  const { data } = useQuery({
    queryKey: ["joinedMeetings"],
    queryFn: fetchJoinedMeetings,
  });

  return (
    <div className="relative mb-5 w-full">
      <div className="mb-6 flex items-center justify-between px-6">
        <h2 className="text-xl font-bold text-gray-900">
          {/* {format(currentStart, "yyyy년 M월 eeee", { locale: ko })} */}
        </h2>
        <div className="mr-1 flex items-center gap-3">
          <button className="notice-wrap relative cursor-pointer">
            {/* 알람이 있을 경우 - 추후 연결
                  <BellDot/>
                  <div className="absolute top-[3px] right-[3px] h-[6px] w-[6px] rounded-full bg-red-500" />
                  */}
            <Bell size={28} />
          </button>

          <button
            onClick={modal.open}
            aria-label="월간 달력 열기"
            className="cursor-pointer"
          >
            <CalendarCheck size={28} />
          </button>
        </div>
      </div>
      <WeeklyCalendar meetings={data?.data ?? []} />

      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header className="mb-4 flex-row items-start justify-between">
            <div>
              <h2 className="text-base-bold">나의 다짐 기록</h2>
              <p className="text-xs-regular -ml-2 rounded-xl bg-gray-100 px-2 py-1">
                <span className="xs:inline-block hidden">이뤄낸 다짐과 </span>
                &nbsp;예정된 다짐을 달력으로 확인할 수 있어요!
              </p>
            </div>
            <Modal.CloseButton className="mb-2" />
          </Modal.Header>
          <div>
            <MonthlyCalendar meetings={data?.data ?? []} />
          </div>
        </Modal>
      )}
    </div>
  );
}
