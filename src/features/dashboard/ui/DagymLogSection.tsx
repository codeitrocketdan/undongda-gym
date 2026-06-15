"use client";

import { format } from "@/shared/lib/date";
import { MonthlyCalendar, WeeklyCalendar } from "@/shared/ui/calendar";
import { Modal, useModal } from "@/shared/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { Dagym } from "../types";
import DagymBottomSheet from "./DagymBottomSheet";
import DagymDetailPanel from "./DagymDetailPanel";

async function fetchJoinedMeetings(): Promise<{ data: Dagym[] }> {
  const response = await fetch("/api/users/me/meetings");
  if (!response.ok) throw new Error(`서버 에러 상태코드: ${response.status}`);
  return response.json();
}

export default function MainContent() {
  const modal = useModal();
  const [weeklySelectedKey, setWeeklySelectedKey] = useState<string | null>(
    null
  );

  const { data } = useQuery({
    queryKey: ["joinedDagyms"],
    queryFn: fetchJoinedMeetings,
  });

  const dagyms = data?.data ?? [];

  const completedDays = useMemo(
    () =>
      new Set(
        dagyms
          .filter((dagym) => dagym.isCompleted)
          .map((dagym) => format(new Date(dagym.dateTime)))
      ),
    [dagyms]
  );

  const reservedDays = useMemo(
    () => new Set(dagyms.map((dagym) => format(new Date(dagym.dateTime)))),
    [dagyms]
  );

  const weeklyDagyms = useMemo(
    () =>
      weeklySelectedKey
        ? dagyms.filter(
            (dagym) => format(new Date(dagym.dateTime)) === weeklySelectedKey
          )
        : [],
    [weeklySelectedKey, dagyms]
  );

  return (
    <div className="relative mb-5 w-full">
      <div className="mb-6 flex items-center justify-between px-6">
        <h2 className="text-xl font-bold text-gray-900" />
        <div className="mr-1 flex items-center gap-3">
          <button
            onClick={modal.open}
            aria-label="월간 달력 열기"
            className="cursor-pointer"
          >
            <CalendarCheck size={28} />
          </button>
        </div>
      </div>

      <WeeklyCalendar
        completedDays={completedDays}
        reservedDays={reservedDays}
        onDateClick={(key) => setWeeklySelectedKey(key)}
      />

      {weeklySelectedKey && (
        <DagymBottomSheet
          selectedDateKey={weeklySelectedKey}
          dagyms={weeklyDagyms}
          onClose={() => setWeeklySelectedKey(null)}
        />
      )}

      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header className="mb-4 flex-row items-start justify-between">
            <div>
              <h2 className="text-base-bold">나의 다짐 기록</h2>
              <p className="text-xs-regular -ml-2 rounded-xl bg-gray-100 px-2 py-1">
                날짜를 클릭하면 내 다짐 정보를 볼 수 있어요
              </p>
            </div>
            <Modal.CloseButton className="mb-2" />
          </Modal.Header>
          <div>
            <MonthlyCalendar
              completedDays={completedDays}
              reservedDays={reservedDays}
              renderDetail={({ selectedDateKey, isActive, onBack }) => (
                <DagymDetailPanel
                  selectedDateKey={selectedDateKey}
                  dagyms={dagyms.filter(
                    (dagym) =>
                      selectedDateKey &&
                      format(new Date(dagym.dateTime)) === selectedDateKey
                  )}
                  onBack={onBack}
                  isActive={isActive}
                />
              )}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
