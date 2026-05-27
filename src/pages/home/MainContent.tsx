import bannerPc from "@/shared/assets/images/banner_1024.png";
import bannerMobile from "@/shared/assets/images/banner_360.png";
import bannerTablet from "@/shared/assets/images/banner_768.png";
import WeeklyCalendar from "@/shared/ui/calendar/WeeklyCalendar";
import Image from "next/image";
// import { useAuthStore } from "@/shared/store/authStore";
import Modal from "@/shared/ui/Modal/Modal";
import { Bell, CalendarCheck } from "lucide-react";

export default function MainContent({ isLogin }: { isLogin: boolean }) {
  const modal = Modal.useModal();
  return (
    <div className="w-full">
      {isLogin ? (
        <>
          <div className="md:hidden">
            <div className="mb-6 flex items-center justify-between px-6">
              <h2 className="text-xl font-bold text-gray-900">
                {/* {format(currentStart, "yyyy년 M월 eeee", { locale: ko })} */}
              </h2>
              <div className="flex items-center gap-3">
                <Bell size={28} />
                <button onClick={modal.open}>
                  <CalendarCheck size={28} />
                </button>
              </div>
            </div>
            <WeeklyCalendar />
          </div>

          <div className="hidden md:block">
            <picture>
              <source media="(min-width: 1024px)" srcSet={bannerPc.src} />
              <Image
                src={bannerTablet}
                alt="지금 모임에 참여해보세요"
                className="w-full"
                priority
              />
            </picture>
          </div>
        </>
      ) : (
        <picture>
          <source media="(min-width: 1024px)" srcSet={bannerPc.src} />
          <source media="(min-width: 768px)" srcSet={bannerTablet.src} />
          <Image src={bannerMobile} alt="지금 모임에 참여해보세요" className="w-full" />
        </picture>
      )}

      {/* {modal.isOpen && (
        <Modal onClose={modal.close}>
          <Modal.Header>
            <h2>모임 만들기</h2>
            <Modal.CloseButton />
          </Modal.Header>
          <div>
            <MonthlyCalendar />
          </div>
        </Modal>
      )} */}
    </div>
  );
}
