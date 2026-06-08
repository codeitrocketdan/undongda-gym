"use client";
import bannerPc from "@/shared/assets/images/banner_1024.png";
import bannerMobile from "@/shared/assets/images/banner_360.png";
import bannerTablet from "@/shared/assets/images/banner_768.png";
import WeeklyCalendar from "@/shared/ui/calendar/WeeklyCalendar";
import Image from "next/image";
// import { useAuthStore } from "@/shared/store/authStore";
import MonthlyCalendar from "@/shared/ui/calendar/MonthlyCalendar";
import Modal from "@/shared/ui/modal/Modal";
import { useModal } from "@/shared/ui/modal/useModal";
import { Bell, CalendarCheck } from "lucide-react";

export default function MainContent({ isLogin }: { isLogin: boolean }) {
  const modal = useModal();
  return (
    <div className="w-full">
      {isLogin ? (
        <>
          <div className="md:hidden">
            <div className="mb-6 flex items-center justify-between px-6">
              <h2 className="text-xl font-bold text-gray-900">
                {/* {format(currentStart, "yyyy년 M월 eeee", { locale: ko })} */}
              </h2>
              <div className="mr-1 flex items-center gap-3">
                <button className="notice-wrap relative">
                  {/* 알람이 있을 경우 - 추후 연결
                  <BellDot/>
                  <div className="absolute top-[3px] right-[3px] h-[6px] w-[6px] rounded-full bg-red-500" />
                  */}
                  <Bell size={28} />
                </button>

                <button onClick={modal.open} aria-label="월간 달력 열기">
                  <CalendarCheck size={28} />
                </button>
              </div>
            </div>
            <WeeklyCalendar />
          </div>

          <div className="hidden md:block">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={bannerPc.src}
                className="hue-rotate-45"
              />
              <Image
                src={bannerTablet}
                alt="지금 모임에 참여해보세요"
                className="w-full hue-rotate-45"
                priority
              />
            </picture>
          </div>
        </>
      ) : (
        <picture>
          <source media="(min-width: 1024px)" srcSet={bannerPc.src} />
          <source media="(min-width: 768px)" srcSet={bannerTablet.src} />
          <Image
            src={bannerMobile}
            alt="지금 모임에 참여해보세요"
            className="w-full"
          />
        </picture>
      )}

      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header className="text-base-bold flex-row justify-between">
            <h2>나의 다짐</h2>
            <Modal.CloseButton className="mb-2" />
          </Modal.Header>
          <div>
            <MonthlyCalendar />
          </div>
        </Modal>
      )}
    </div>
  );
}
