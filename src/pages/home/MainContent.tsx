import bannerPc from "@/shared/assets/images/banner_1024.png";
import bannerMobile from "@/shared/assets/images/banner_360.png";
import bannerTablet from "@/shared/assets/images/banner_768.png";
import WeeklyCalendar from "@/shared/ui/calendar/WeeklyCalendar";
import Image from "next/image";
// import { useAuthStore } from "@/shared/store/authStore";

export default function MainContent({ isLogin }: { isLogin: boolean }) {
  return (
    <div className="w-full">
      {isLogin ? (
        <>
          <div className="md:hidden">
            <WeeklyCalendar />
            {/* <MonthlyCalendar /> */}
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
    </div>
  );
}
